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
function makeDeleteRoleDetail({ roleDb, userDb, makeNotification, internalServer }) {
    return function deleteRoleDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                const validasiBusiness = yield roleDb.checkBeforeDelete(body);
                if (validasiBusiness.status == true) {
                    const checkWorkflow = yield validasiWorkflow(body);
                    console.log('checkworkflow', checkWorkflow);
                    if (checkWorkflow.status == true) {
                        if (checkWorkflow.data == 'true') {
                            let menuData = yield Promise.all(body.rowId.map((id) => __awaiter(this, void 0, void 0, function* () {
                                const dataOld = yield roleDb.getDataRoleDetail({ rowId: id });
                                return dataOld.data;
                            })));
                            const dataRequest = {
                                username: body.usernameToken,
                                moduleId: body.moduleId,
                                menuId: '005',
                                backendUrl: '/credential/role/detail',
                                method: 'DELETE',
                                menuData: menuData,
                                menuDataNew: {}
                            };
                            if (body.rowId.length > 1) {
                                dataRequest.keyId = 'multiple';
                                dataRequest.keyName = 'multiple';
                            }
                            else {
                                dataRequest.keyId = menuData[0].roleId;
                                dataRequest.keyName = menuData[0].roleName;
                            }
                            const workflowRequest = yield internalServer.workflowRequest(dataRequest);
                            console.log('workflowReq', workflowRequest);
                            if (workflowRequest.status == 'pending') {
                                const getListRole = yield userDb.getListRoleNotifWorkflow();
                                yield getListRole.map((data) => __awaiter(this, void 0, void 0, function* () {
                                    const entityNotif = yield makeNotification({
                                        moduleId: body.moduleId,
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
                                    moduleId: body.moduleId,
                                    username: body.username,
                                    title: 'Data Role berhasil dikirim dan sedang menunggu persetujuan',
                                    titleGlob: 'Data Role sent successfully and waiting for approval ',
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
                                const data = yield roleDb.deleteDataRoleDetail(body);
                                if (data.code == 200) {
                                    const entityNotif = yield makeNotification({
                                        moduleId: body.moduleId,
                                        username: body.usernameToken,
                                        title: 'Role Dihilangkan',
                                        titleGlob: 'Deleted Role',
                                        message: body.rowId.length + ' Role',
                                        messageGlob: body.rowId.length + ' Role',
                                        status: 0
                                    });
                                    const sendNotification = yield userDb.inputDataNotification(entityNotif);
                                    console.log('sendNotif', sendNotification);
                                }
                                result = {
                                    status: data.status,
                                    responseCode: data.code,
                                    data: {
                                        locl: data.message,
                                        glob: data.messageGlob
                                    }
                                };
                            }
                            else {
                                if (workflowRequest.responseCode == 406) {
                                    const errData = yield Promise.all(yield workflowRequest.errorData.map((data) => __awaiter(this, void 0, void 0, function* () {
                                        const errCode = yield roleDb.getErrorCode({ info: 'false delete workflow' });
                                        return {
                                            id: data,
                                            locl: errCode.local,
                                            glob: errCode.global
                                        };
                                    })));
                                    result = {
                                        status: false,
                                        responseCode: workflowRequest.responseCode,
                                        data: errData
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
                            const errData = yield Promise.all(yield checkWorkflow.errData.map((data) => __awaiter(this, void 0, void 0, function* () {
                                const errCode = yield roleDb.getErrorCode({ info: checkWorkflow.data });
                                return {
                                    id: data,
                                    locl: errCode.local,
                                    glob: errCode.global
                                };
                            })));
                            result = {
                                status: false,
                                responseCode: 406,
                                data: errData
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
                const checkWorkflowOn = yield internalServer.checkWorkflowOn({ menuId: '005', backendUrl: '/credential/role/detail', method: 'DELETE' });
                // console.log('check workflow', checkWorkflowOn);
                let result;
                if (checkWorkflowOn == true) {
                    const getDataWorkflow = yield internalServer.checkDataWorkflow({ menuId: '005', backendUrl: '/credential/role/detail', method: 'DELETE' });
                    console.log('getData', getDataWorkflow.data);
                    if (getDataWorkflow.status == true) {
                        if (getDataWorkflow.data.length > 0) {
                            let hasil = 'true';
                            let dataError = [];
                            yield flow.rowId.map((data) => __awaiter(this, void 0, void 0, function* () {
                                const find = getDataWorkflow.data.find(function validasiId(workflow) {
                                    return workflow.id === data;
                                });
                                if (find != undefined) {
                                    console.log('fn', find);
                                    hasil = 'false delete workflow';
                                    dataError.push(find.id);
                                }
                                else {
                                    console.log('undefine', find);
                                    hasil = 'true';
                                }
                            }));
                            if (dataError.length > 0) {
                                result = { status: true, data: 'false delete workflow', errData: dataError };
                            }
                            else {
                                result = { status: true, data: hasil };
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
                    result = { status: true, data: 'true' };
                }
                // console.log('result', result);
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = makeDeleteRoleDetail;
