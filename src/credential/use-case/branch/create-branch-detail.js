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
function makeCreateBranchDetail({ branchDb, userDb, makeBranch, makeNotification, internalServer }) {
    return function createBranchDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validasiBusiness = yield branchDb.validasiBranch(Object.assign(Object.assign({}, body), { info: 'create' }));
                let result;
                if (validasiBusiness.status == true) {
                    const checkWorkflow = yield validasiWorkflow({ branchName: body.branchName, branchId: body.branchId });
                    if (checkWorkflow.status == true) {
                        if (checkWorkflow.data == 'true') {
                            const branch = yield makeBranch(body);
                            const dataRequest = {
                                username: branch.getUsernameToken(),
                                moduleId: branch.getModuleId(),
                                menuId: '006',
                                backendUrl: '/credential/branch/detail',
                                method: 'PUT',
                                menuData: {},
                                menuDataNew: {
                                    branchId: branch.getBranchId(),
                                    branchName: branch.getBranchName(),
                                    createdUser: branch.getUsernameToken(),
                                    createdTime: branch.getCreatedTime(),
                                    updatedUser: null,
                                    updatedTime: null
                                },
                                keyId: branch.getBranchId(),
                                keyName: branch.getBranchName()
                            };
                            const workflowRequest = yield internalServer.workflowRequest(dataRequest);
                            console.log('workflowreq', workflowRequest);
                            if (workflowRequest.status == 'pending') {
                                const getListRole = yield userDb.getListRoleNotifWorkflow();
                                getListRole.map((data) => __awaiter(this, void 0, void 0, function* () {
                                    const entityNotif = yield makeNotification({
                                        moduleId: branch.getModuleId(),
                                        username: data.username,
                                        title: 'Permintaan Persetujuan Cabang',
                                        titleGlob: 'Branch Approval Request',
                                        message: '1 Cabang',
                                        messageGlob: '1 Branch',
                                        status: 0
                                    });
                                    // const sendNotification = await userDb.inputDataNotification(entityNotif)
                                    // console.log('sendNotif', sendNotification);
                                    userDb.inputDataNotification(entityNotif);
                                }));
                                const entityNotif = yield makeNotification({
                                    moduleId: branch.getModuleId(),
                                    username: branch.getUsernameToken(),
                                    title: 'Data Cabang Baru berhasil dikirim dan sedang menunggu persetujuan',
                                    titleGlob: 'Data New Branch sent successfully and waiting for approval ',
                                    message: '1 Cabang',
                                    messageGlob: '1 Branch',
                                    status: 0
                                });
                                // const sendNotification = await userDb.inputDataNotification(entityNotif)
                                // console.log('sendNotif', sendNotification);
                                userDb.inputDataNotification(entityNotif);
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
                                const create = yield branchDb.createDataBranchDetail(branch);
                                if (create.code == 200) {
                                    const entityNotif = yield makeNotification({
                                        moduleId: branch.getModuleId(),
                                        username: branch.getUsernameToken(),
                                        title: 'Cabang Baru Ditambahkan',
                                        titleGlob: 'New inserted Branch',
                                        message: '1 Cabang',
                                        messageGlob: '1 Branch',
                                        status: 0
                                    });
                                    const sendNotification = yield userDb.inputDataNotification(entityNotif);
                                    console.log('sendNotif', sendNotification);
                                    result = {
                                        status: create.status,
                                        responseCode: create.code,
                                        data: {
                                            locl: create.message,
                                            glob: create.messageGlob
                                        },
                                        id: create.id
                                    };
                                }
                                else {
                                    if (create.code == 406) {
                                        const errCode = yield branchDb.getErrorCode({ info: 'false id' });
                                        result = {
                                            status: false,
                                            responseCode: 406,
                                            data: {
                                                locl: errCode.local,
                                                glob: errCode.global
                                            }
                                        };
                                    }
                                    else {
                                        result = {
                                            status: create.status,
                                            responseCode: create.code,
                                            data: {
                                                locl: create.message,
                                                glob: create.messageGlob
                                            }
                                        };
                                    }
                                }
                            }
                            else {
                                if (workflowRequest.responseCode == 406) {
                                    const errCode = yield branchDb.getErrorCode({ info: workflowRequest.data });
                                    result = {
                                        status: false,
                                        responseCode: 406,
                                        data: {
                                            locl: errCode.local,
                                            glob: errCode.global
                                        }
                                    };
                                }
                                else if (workflowRequest.responseCode == 500) {
                                    result = {
                                        status: workflowRequest.status,
                                        responseCode: workflowRequest.responseCode,
                                        data: {
                                            locl: workflowRequest.data,
                                            glob: workflowRequest.data
                                        }
                                    };
                                }
                                else {
                                    result = {
                                        status: workflowRequest.status,
                                        responseCode: workflowRequest.responseCode,
                                        data: {
                                            locl: 'Data Gagal Dikirim',
                                            glob: 'Data Sent Failed'
                                        }
                                    };
                                }
                            }
                        }
                        else {
                            const errCode = yield branchDb.getErrorCode({ info: checkWorkflow });
                            result = {
                                status: false,
                                responseCode: 406,
                                data: {
                                    locl: errCode.local,
                                    glob: errCode.global
                                }
                            };
                        }
                    }
                    else {
                        result = {
                            status: false,
                            responseCode: 500,
                            data: checkWorkflow.data
                        };
                    }
                }
                else {
                    result = {
                        status: false,
                        responseCode: 406,
                        data: validasiBusiness.data
                    };
                }
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    };
    function validasiWorkflow(flow) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkWorkflowOn = yield internalServer.checkWorkflowOn({ menuId: '006', backendUrl: '/credential/branch/detail', method: 'PUT' });
                let result;
                if (checkWorkflowOn == true) {
                    const getDataWorkflow = yield internalServer.checkDataWorkflow({ menuId: '006', backendUrl: '/credential/branch/detail' });
                    if (getDataWorkflow.status == true) {
                        if (getDataWorkflow.data.length > 0) {
                            function validasiBranchId(workflow) {
                                return workflow.branchId === flow.branchId;
                            }
                            function validasiBranchName(workflow) {
                                return workflow.branchName === flow.branchName;
                            }
                            const find = getDataWorkflow.data.find(validasiBranchId);
                            if (find != undefined) {
                                // console.log('find', find);
                                result = { status: true, data: 'false id' };
                            }
                            else {
                                const findName = getDataWorkflow.data.find(validasiBranchName);
                                if (findName != undefined) {
                                    result = { status: true, data: 'false name' };
                                }
                                else {
                                    result = { status: true, data: 'true' };
                                }
                            }
                        }
                        else {
                            result = { status: true, data: 'true' };
                        }
                    }
                    else {
                        result = { status: false, data: getDataWorkflow.data };
                    }
                }
                else {
                    console.log('workflow mati');
                    result = { status: true, data: 'true' };
                }
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = makeCreateBranchDetail;
