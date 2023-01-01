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
function makeCreateRoleDetail({ roleDb, userDb, makeRole, makeNotification, internalServer }) {
    return function createRoleDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validasiRole = yield makeRole(body);
                const validasiBusiness = yield roleDb.validasiRole(Object.assign(Object.assign({}, validasiRole), { info: 'create' }));
                let result;
                if (validasiBusiness.status == true) {
                    const checkWorkflow = yield validasiWorkflow(validasiRole);
                    if (checkWorkflow.status == true) {
                        if (checkWorkflow.data == 'true') {
                            const dataRequest = {
                                username: validasiRole.getUsernameToken(),
                                moduleId: validasiRole.getModuleId(),
                                menuId: '005',
                                backendUrl: '/credential/role/detail',
                                method: 'PUT',
                                menuData: {},
                                menuDataNew: {
                                    roleId: validasiRole.getRoleId(),
                                    roleName: validasiRole.getRoleName(),
                                    createdUser: validasiRole.getUsernameToken(),
                                    createdTime: validasiRole.getCreatedTime(),
                                    updatedUser: null,
                                    updatedTime: null
                                },
                                keyId: validasiRole.getRoleId(),
                                keyName: validasiRole.getRoleName()
                            };
                            console.log('datareq', dataRequest);
                            const workflowRequest = yield internalServer.workflowRequest(dataRequest);
                            if (workflowRequest.status == 'pending') {
                                const getListRole = yield userDb.getListRoleNotifWorkflow();
                                yield getListRole.map((data) => __awaiter(this, void 0, void 0, function* () {
                                    const entityNotif = yield makeNotification({
                                        moduleId: validasiRole.getModuleId(),
                                        username: data.username,
                                        title: 'Permintaan Persetujuan Role',
                                        titleGlob: 'Role Approval Request',
                                        message: '1 Role',
                                        messageGlob: '1 Role',
                                        status: 0
                                    });
                                    const sendNotification = yield userDb.inputDataNotification(entityNotif);
                                    console.log('sendNotif', sendNotification);
                                }));
                                const entityNotif = yield makeNotification({
                                    moduleId: validasiRole.getModuleId(),
                                    username: validasiRole.getUsernameToken(),
                                    title: 'Data Role Baru berhasil dikirim dan sedang menunggu persetujuan',
                                    titleGlob: 'Data New Role sent successfully and waiting for approval ',
                                    message: '1 Role',
                                    messageGlob: '1 Role',
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
                                const create = yield roleDb.createDataRoleDetail(validasiRole);
                                if (create.code == 200) {
                                    const entityNotif = yield makeNotification({
                                        moduleId: validasiRole.getModuleId(),
                                        username: validasiRole.getUsernameToken(),
                                        title: 'Role Baru Ditambahkan',
                                        titleGlob: 'New Inserted Role',
                                        message: '1 Role',
                                        messageGlob: '1 Role',
                                        status: 0
                                    });
                                    const sendNotification = yield userDb.inputDataNotification(entityNotif);
                                    console.log('sendNotif', sendNotification);
                                }
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
                                if (workflowRequest.responseCode == 406) {
                                    const errCode = yield roleDb.getErrorCode({ info: 'waiting' });
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
                                        status: false,
                                        responseCode: 500,
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
                            const errCode = yield roleDb.getErrorCode({ info: checkWorkflow.data });
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
                            data: {
                                locl: checkWorkflow.data,
                                glob: checkWorkflow.data
                            }
                        };
                    }
                }
                else {
                    result = {
                        status: false,
                        responseCode: validasiBusiness.responseCode,
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
                const checkWorkflowOn = yield internalServer.checkWorkflowOn({ menuId: '005', backendUrl: '/credential/role/detail', method: 'PUT' });
                let result;
                if (checkWorkflowOn == true) {
                    const getDataWorkflow = yield internalServer.checkDataWorkflow({ menuId: '005', backendUrl: '/credential/role/detail' });
                    // console.log('getdata', getDataWorkflow.data);
                    if (getDataWorkflow.status == true) {
                        if (getDataWorkflow.data.length > 0) {
                            function validasiRoleId(workflow) {
                                return workflow.roleId === flow.getRoleId();
                            }
                            function validasiRoleName(workflow) {
                                return workflow.roleName === flow.getRoleName();
                            }
                            const find = getDataWorkflow.data.find(validasiRoleId);
                            if (find != undefined) {
                                result = { status: true, data: 'false id' };
                            }
                            else {
                                const findName = getDataWorkflow.data.find(validasiRoleName);
                                if (findName != undefined) {
                                    result = { status: true, data: 'false name' };
                                }
                                else {
                                    result = { status: true, data: 'true' };
                                }
                            }
                            console.log('find', find);
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
exports.default = makeCreateRoleDetail;
