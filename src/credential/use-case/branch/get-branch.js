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
function makeGetBranch({ branchDb, moment, internalServer }) {
    return function getBranch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const branch = yield branchDb.getDataBranch(body);
                let result;
                if (branch.status == true) {
                    const getDataWorkflow = yield internalServer.getWorkflowRequest({ menuId: '006', backendUrl: '/credential/branch/detail' });
                    const dataWorkflow = getDataWorkflow.data.menuData;
                    let dataBranch;
                    if (branch.data.length > 0) {
                        dataBranch = yield Promise.all(branch.data.map((data) => __awaiter(this, void 0, void 0, function* () {
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
                                console.log('workflow', workflow);
                                return workflow.id === data.id;
                            }
                            const find = dataWorkflow.find(dataPending);
                            if (find != undefined) {
                                console.log('id', find.id);
                                data.pending = 'yes';
                            }
                            else {
                                data.pending = 'no';
                            }
                            // dataWorkflow.forEach(row => {
                            //   if(Array.isArray(row)) {
                            //     let check = row.find(dataPending)
                            //     if(check!=undefined) {
                            //       console.log('id', check.id);
                            //       data.pending = 'yes'
                            //     }
                            //   }
                            // });
                            return data;
                        })));
                    }
                    else {
                        dataBranch = branch.data;
                    }
                    result = {
                        status: true,
                        responseCode: 200,
                        data: dataBranch,
                        info: {
                            allrec: branch.countAll,
                            sentrec: branch.data.length
                        },
                        filter: branch.filter
                    };
                }
                else {
                    result = {
                        status: false,
                        responseCode: branch.responseCode,
                        data: branch.data
                    };
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-makeGetBranch' + error);
            }
        });
    };
}
exports.default = makeGetBranch;
