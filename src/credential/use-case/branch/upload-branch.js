"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
function makeUploadBranch({ branchDb, userDb, makeNotification, ExcelJs, makeBranch, moment, internalServer }) {
    return function uploadBranch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('usecase',body);
                const workbook = new ExcelJs.Workbook(); //creating workbook  
                let dataBranch = [];
                const bufferExcel = Buffer.from(body.file.data);
                // console.log('sa');
                let branchId = [];
                yield workbook.xlsx.load(bufferExcel).then(function () {
                    // console.log('masuk');
                    const worksheet = workbook.getWorksheet(1);
                    worksheet.eachRow(function (row, rowNumber) {
                        if (rowNumber > 1) {
                            const data = {
                                branchId: row._cells[0]._value.value,
                                branchName: row._cells[1]._value.value
                            };
                            dataBranch.push(data);
                            branchId.push(data.branchId);
                        }
                    });
                });
                const basedir = __dirname;
                const fileDir = basedir.toString().replace(/branch/, "file/");
                const filename = 'branch-upload-' + moment().tz("Asia/Jakarta").format('YYMMDDHHmmss') + '.xlsx';
                const writefile = yield workbook.xlsx.writeFile(fileDir + filename);
                const getUser = yield internalServer.getMasterUser(body);
                const find = getUser.data.users.find(function findUser(data) {
                    return data.username === body.usernameToken;
                });
                let fullname;
                if (find != undefined) {
                    fullname = find.fullname;
                }
                else {
                    fullname = '';
                }
                const getDataBranch = yield branchDb.getDataBranchAll();
                let result;
                if (getDataBranch.status == true) {
                    const dataBranchUpload = yield Promise.all(getDataBranch.data.map(data => {
                        return { menuData: data, keyId: data.branchId, keyName: data.branchName };
                    }));
                    const dataRequest = {
                        username: body.usernameToken,
                        moduleId: body.moduleId,
                        menuId: '006',
                        backendUrl: '/credential/branch/upload',
                        method: 'UPLOAD',
                        dataUpload: dataBranchUpload,
                        menuData: null,
                        menuDataNew: {
                            deleteDataOld: body.deleteDataOld,
                            fileLocation: fileDir + filename,
                            fileName: filename,
                            name: fullname,
                            UrlDownload: process.env.URL_HOST_ME + '/branch/download/workflow/' + filename,
                            urlUpload: process.env.URL_HOST_ME + '/branch/upload/workflow/'
                        }
                    };
                    const workflowRequest = yield internalServer.workflowRequestUpload(dataRequest);
                    console.log('workflow req', workflowRequest);
                    if (workflowRequest.status == 'pending') {
                        const getListRole = yield userDb.getListRoleNotifWorkflow();
                        yield getListRole.map((data) => __awaiter(this, void 0, void 0, function* () {
                            const entityNotif = yield makeNotification({
                                moduleId: body.moduleId,
                                username: data.username,
                                title: 'Permintaan Persetujuan Unggah Cabang',
                                titleGlob: 'Branch Upload Approval Request',
                                message: '1 Data Unggah Cabang',
                                messageGlob: '1 Data Branch Upload',
                                status: 0
                            });
                            const sendNotification = yield userDb.inputDataNotification(entityNotif);
                            console.log('sendNotif', sendNotification);
                        }));
                        const entityNotif = yield makeNotification({
                            moduleId: body.moduleId,
                            username: body.usernameToken,
                            title: 'Data Unggah Cabang berhasil dikirim dan sedang menunggu persetujuan',
                            titleGlob: 'Data Branch Upload sent successfully and waiting for approval ',
                            message: '1 Data Unggah Cabang',
                            messageGlob: '1 Data Branch Upload',
                            status: 0
                        });
                        const sendNotification = yield userDb.inputDataNotification(entityNotif);
                        console.log('sendNotif', sendNotification);
                        result = {
                            status: 'pending',
                            responseCode: 200,
                            data: {
                                locl: 'Data berhasil dikirim dan sedang menunggu persetujuan',
                                glob: 'Data sent successfully and waiting for approval'
                            }
                        };
                    }
                    else if (workflowRequest.status == 'completed') {
                        let infoInsert = 'success';
                        let resultInsert = [];
                        if (body.deleteDataOld.toLowerCase() == 'yes') {
                            console.log('hapus data lama');
                            const deleteBranch = yield branchDb.deleteDataBranchAll();
                            if (deleteBranch.status == true) {
                                for (let index = 0; index < dataBranch.length; index++) {
                                    const entity = {
                                        moduleId: body.moduleId,
                                        usernameToken: body.usernameToken,
                                        branchId: dataBranch[index].branchId,
                                        branchName: dataBranch[index].branchName
                                    };
                                    const branch = yield makeBranch(entity);
                                    const checkBranchId = yield branchDb.checkBranchId(branch);
                                    console.log('checkbranchid', checkBranchId);
                                    if (checkBranchId == 'true') {
                                        //update
                                        console.log('update data');
                                        const validasiBusiness = yield branchDb.validasiBranch(Object.assign(Object.assign({}, branch), { info: 'update' }));
                                        if (validasiBusiness.status == true) {
                                            const createBranch = yield branchDb.updateDataBranchUpload(branch);
                                            resultInsert.push(createBranch);
                                        }
                                        else {
                                            infoInsert = 'failed';
                                            const dataB = {
                                                code: 400,
                                                data: { locl: 'Branch Name ' + entity.branchName + ' sudah terpakai', glob: 'Branch Name ' + entity.branchName + ' already used' }
                                            };
                                            resultInsert.push(dataB);
                                        }
                                    }
                                    else {
                                        //insert 
                                        console.log('insert data');
                                        const checkBranchName = yield branchDb.checkBranchName(branch);
                                        console.log('check branch name', checkBranchName);
                                        if (checkBranchName == false) {
                                            const createBranch = yield branchDb.createDataBranchDetail(branch);
                                            resultInsert.push(createBranch);
                                        }
                                        else {
                                            infoInsert = 'failed';
                                            const dataB = {
                                                code: 400,
                                                data: { locl: 'Branch Name ' + entity.branchName + ' sudah terpakai', glob: 'Branch Name ' + entity.branchName + ' already used' }
                                            };
                                            resultInsert.push(dataB);
                                        }
                                    }
                                }
                            }
                            else {
                                infoInsert = 'Delete Data Old Failed';
                            }
                        }
                        else {
                            console.log('delete no');
                            for (let index = 0; index < dataBranch.length; index++) {
                                const entity = {
                                    moduleId: body.moduleId,
                                    usernameToken: body.usernameToken,
                                    branchId: dataBranch[index].branchId,
                                    branchName: dataBranch[index].branchName
                                };
                                const branch = yield makeBranch(entity);
                                const checkBranchId = yield branchDb.checkBranchId(branch);
                                console.log('checkbranchid', checkBranchId);
                                if (checkBranchId == 'true') {
                                    //update
                                    console.log('update data');
                                    const checkBranchName = yield branchDb.checkBranchNameUpload(Object.assign(Object.assign({}, branch), { info: 'updated' }));
                                    console.log('check branch name', checkBranchName);
                                    if (checkBranchName == false) {
                                        const updateBranch = yield branchDb.updateDataBranchUpload(branch);
                                        resultInsert.push(updateBranch);
                                    }
                                    else {
                                        infoInsert = 'failed';
                                        const dataB = {
                                            code: 400,
                                            data: { locl: 'Branch Name ' + entity.branchName + ' sudah terpakai', glob: 'Branch Name ' + entity.branchName + ' already used' }
                                        };
                                        resultInsert.push(dataB);
                                    }
                                }
                                else {
                                    //insert 
                                    console.log('insert data');
                                    const checkBranchName = yield branchDb.checkBranchNameUpload(Object.assign(Object.assign({}, branch), { info: 'created' }));
                                    console.log('check branch name', checkBranchName);
                                    if (checkBranchName == false) {
                                        const createBranch = yield branchDb.createDataBranchDetail(branch);
                                        resultInsert.push(createBranch);
                                    }
                                    else {
                                        infoInsert = 'failed';
                                        const dataB = {
                                            code: 400,
                                            data: { locl: 'Branch Name ' + entity.branchName + ' sudah terpakai', glob: 'Branch Name ' + entity.branchName + ' already used' }
                                        };
                                        resultInsert.push(dataB);
                                    }
                                }
                            }
                        }
                        if (infoInsert == 'success') {
                            const entityNotif = yield makeNotification({
                                moduleId: body.moduleId,
                                username: body.usernameToken,
                                title: 'Cabang Baru Diunggah',
                                titleGlob: 'New Uploaded Branch',
                                message: dataBranch.length + ' Cabang',
                                messageGlob: dataBranch.length + ' Branch',
                                status: 0
                            });
                            const sendNotification = yield userDb.inputDataNotification(entityNotif);
                            console.log('sendNotification', sendNotification);
                            result = {
                                status: 'completed',
                                responseCode: 200,
                                data: {
                                    locl: 'Cabang Berhasil Diunggah',
                                    glob: 'Branch Uploaded Successfully'
                                }
                            };
                        }
                        else {
                            let errorData = [];
                            yield resultInsert.map(data => {
                                if (data.code == 400) {
                                    errorData.push(data.data);
                                }
                            });
                            result = {
                                status: false,
                                responseCode: 400,
                                data: {
                                    locl: 'Cabang Berhasil Diunggah kecuali di dalam object errorData',
                                    glob: 'Branch uploaded successfully except inside object errorData',
                                },
                                errorData: errorData
                            };
                        }
                    }
                    else {
                        let data;
                        if (workflowRequest.responseCode == 409) {
                            data = workflowRequest.data;
                        }
                        else {
                            data = { locl: 'Data Gagal Dikirim', glob: 'Data Sent Failed' };
                        }
                        result = {
                            status: workflowRequest.status,
                            responseCode: 400,
                            data: data
                        };
                    }
                }
                else {
                    result = getDataBranch;
                }
                console.log('res', result);
                return result;
            }
            catch (error) {
                throw new Error('upload branch ' + error);
            }
        });
    };
}
exports.default = makeUploadBranch;
