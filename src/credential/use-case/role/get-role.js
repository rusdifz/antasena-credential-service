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
function makeGetRole({ roleDb, moment, internalServer }) {
    return function getRole(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield roleDb.getDataRole(body);
                let result;
                if (role.status == true) {
                    const getDataWorkflow = yield internalServer.getWorkflowRequest({ menuId: '005', backendUrl: '/credential/role/detail' });
                    const dataWorkflow = getDataWorkflow.data.menuData;
                    let dataRole = [];
                    if (role.data.length > 0) {
                        role.data.map(data => {
                            const createdTime = moment(data.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                            let updatedTime;
                            if (data.updatedTime == null) {
                                updatedTime = null;
                            }
                            else {
                                updatedTime = moment(data.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                            }
                            delete data.createdTime;
                            delete data.updatedTime;
                            data.createdTime = createdTime;
                            data.updatedTime = updatedTime;
                            function dataPending(workflow) {
                                // console.log('workflow', workflow);
                                return workflow.id === data.id;
                            }
                            const find = dataWorkflow.find(dataPending);
                            if (find != undefined) {
                                data.pending = 'yes';
                            }
                            else {
                                data.pending = 'no';
                            }
                            // dataWorkflow.forEach(row => {
                            //   console.log('row', row);
                            //   if(Array.isArray(row)) {
                            //     let check = row.find(dataPending)
                            //     if(check!=undefined) {
                            //       console.log('id', check.id);
                            //       data.pending = 'yes'
                            //     }
                            //   }
                            // });
                            dataRole.push(data);
                        });
                    }
                    else {
                        dataRole = [];
                    }
                    result = {
                        status: true,
                        responseCode: 200,
                        data: dataRole,
                        info: {
                            allrec: role.countAll,
                            sentrec: role.data.length
                        },
                        filter: role.filter
                    };
                }
                else {
                    result = {
                        status: false,
                        responseCode: role.responseCode,
                        data: role.data
                    };
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-getRole' + error);
            }
        });
    };
}
exports.default = makeGetRole;
