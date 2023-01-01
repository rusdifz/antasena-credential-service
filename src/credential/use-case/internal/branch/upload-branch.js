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
function makeInternalUploadBranch({ branchDb, userDb, makeNotification, ExcelJs, makeBranch }) {
    return function internalUploadBranch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('usecase', body);
                const workbook = new ExcelJs.Workbook(); //creating workbook
                let dataBranch = [];
                const filename = body.fileLocation;
                let branchId = [];
                yield workbook.xlsx.readFile(filename).then(function () {
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
                let result;
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
                        title: 'Permintaan Unggah Cabang Baru Disetujui Oleh Approver',
                        titleGlob: 'New Branch Upload Request Approved By Approval',
                        message: dataBranch.length + ' Berkas',
                        messageGlob: dataBranch.length + ' File',
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
                    resultInsert.map(data => {
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
                return result;
            }
            catch (error) {
                throw new Error('upload branch ' + error);
            }
        });
    };
}
exports.default = makeInternalUploadBranch;
