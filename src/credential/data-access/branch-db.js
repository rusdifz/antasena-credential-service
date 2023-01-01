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
const environment = process.env.ENVIRONMENT;
function makeBranchDb({ QueryGet, QueryTransaction }) {
    return Object.freeze({
        validasiBranch,
        downloadBranch,
        checkBranchId,
        checkBranchName,
        checkBranchNameUpload,
        getDataBranch,
        getDataBranchInternal,
        getDataBranchDetail,
        getDataBranchAll,
        getErrorCode,
        createDataBranchDetail,
        updateDataBranchDetail,
        updateDataBranchUpload,
        checkBeforeDelete,
        deleteDataBranchDetail,
        deleteDataBranchUpload,
        deleteDataBranchDetailInternal,
        deleteDataBranchAll
    });
    function validasiBranch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const sqlNameCreate = `SELECT branch_name FROM m_branch_rpt WHERE branch_name = '${body.branchName}' AND module_id = '${body.moduleId}'`;
                        const sqlNameUpdate = `SELECT branch_name FROM m_branch_rpt WHERE branch_name = '${body.branchName}' AND module_id = '${body.moduleId}' AND branch_id <> '${body.branchId}'`;
                        const lookupErrId = "SELECT err_desc_locl as 'local', err_desc_glob as 'global' FROM m_errcode WHERE err_code = 'B001'";
                        const lookupErrName = "SELECT err_desc_locl as 'local', err_desc_glob as 'global' FROM m_errcode WHERE err_code = 'B002'";
                        let datasend;
                        if (body.info == 'update') {
                            let checkName = yield QueryGet(sqlNameUpdate);
                            if (checkName.data.recordset.length > 0) {
                                let resErrName = yield QueryGet(lookupErrName);
                                datasend = {
                                    status: false,
                                    data: {
                                        locl: resErrName.data.recordset[0].local,
                                        glob: resErrName.data.recordset[0].global
                                    }
                                };
                            }
                            else {
                                datasend = {
                                    status: true,
                                    data: "OK"
                                };
                            }
                        }
                        else {
                            let checkId = yield checkBranchId(body);
                            if (checkId == 'true') {
                                let resErrId = yield QueryGet(lookupErrId);
                                datasend = {
                                    status: false,
                                    data: {
                                        locl: resErrId.data.recordset[0].local,
                                        glob: resErrId.data.recordset[0].global
                                    }
                                };
                            }
                            else {
                                let checkName = yield QueryGet(sqlNameCreate);
                                if (checkName.data.recordset.length > 0) {
                                    let resErrName = yield QueryGet(lookupErrName);
                                    datasend = {
                                        status: false,
                                        data: {
                                            locl: resErrName.data.recordset[0].local,
                                            glob: resErrName.data.recordset[0].global
                                        }
                                    };
                                }
                                else {
                                    datasend = {
                                        status: true,
                                        data: "OK"
                                    };
                                }
                            }
                        }
                        resolve(datasend);
                    }
                    catch (error) {
                        reject(new Error('validasiBranch ' + error));
                    }
                });
            });
        });
    }
    // async function validasiBranch(body){
    //   return new Promise(async function(resolve, reject) {
    //     try{
    //       const sqlNameCreate = `SELECT branch_name FROM m_branch_rpt WHERE branch_name = '${body.getBranchName()}' AND module_id = '${body.getModuleId()}'`;
    //       const sqlNameUpdate = `SELECT branch_name FROM m_branch_rpt WHERE branch_name = '${body.getBranchName()}' AND module_id = '${body.getModuleId()}' AND branch_id <> '${body.getBranchId()}'`
    //       const lookupErrId = "SELECT err_desc_locl as 'local', err_desc_glob as 'global' FROM m_errcode WHERE err_code = 'B001'"
    //       const lookupErrName = "SELECT err_desc_locl as 'local', err_desc_glob as 'global' FROM m_errcode WHERE err_code = 'B002'"
    //       let datasend
    //       if(body.info == 'update'){
    //         let checkName = await QueryGet(sqlNameUpdate)
    //         if(checkName.data.recordset.length > 0){
    //           let resErrName = await QueryGet(lookupErrName);
    //           datasend = {
    //             status: false,
    //             data: {
    //               locl: resErrName.data.recordset[0].local,
    //               glob: resErrName.data.recordset[0].global
    //             }
    //           }
    //         }else{
    //           datasend = {
    //             status: true,
    //             data: "OK" 
    //           }
    //         }
    //       }else{
    //         let checkId = await checkBranchId(body)
    //         if(checkId == 'true'){
    //           let resErrId = await QueryGet(lookupErrId);
    //           datasend = {
    //             status: false,
    //             data: {
    //               locl: resErrId.data.recordset[0].local,
    //               glob: resErrId.data.recordset[0].global
    //             }
    //           }
    //         }else{
    //           let checkName = await QueryGet(sqlNameCreate)
    //           if(checkName.data.recordset.length > 0){
    //             let resErrName = await QueryGet(lookupErrName);
    //             datasend = {
    //               status: false,
    //               data: {
    //                 locl: resErrName.data.recordset[0].local,
    //                 glob: resErrName.data.recordset[0].global
    //               }
    //             }
    //           }else{
    //             datasend = {
    //               status: true,
    //               data: "OK" 
    //             }
    //           }
    //         }
    //       }
    //       resolve(datasend)
    //     } catch(error){
    //       reject(new Error('validasiBranch '+error));
    //     }
    //   })
    // }
    function getErrorCode(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let errCode;
                        if (body.info == 'waiting') {
                            errCode = 'B004';
                        }
                        else if (body.info == 'waiting name') {
                            errCode = 'B008';
                        }
                        else if (body.info == 'false id') {
                            errCode = 'B005';
                        }
                        else if (body.info == 'false delete workflow') {
                            errCode = 'B007';
                        }
                        else {
                            errCode = 'B006';
                        }
                        let sql = "SELECT err_desc_locl as 'local', err_desc_glob as 'global' FROM m_errcode WHERE err_code = '" + errCode + "' ";
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve(result.data.recordset[0]);
                            }
                            else {
                                resolve({ local: '', global: '' });
                            }
                        }
                        else {
                            resolve({ local: '', global: '' });
                        }
                    }
                    catch (error) {
                        reject(new Error('getErrorCode ' + error));
                    }
                });
            });
        });
    }
    function downloadBranch() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT id, branch_id, branch_name, created_user, created_time, updated_user, updated_time 
                    FROM m_branch_rpt ORDER BY id asc`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, data: result.data.recordset });
                            }
                            else {
                                resolve({ status: true, data: [] });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('downloadBranch ' + error));
                    }
                });
            });
        });
    }
    function checkBranchId(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        // let sql = `SELECT branch_id FROM m_branch_rpt WHERE branch_id = '${body.getBranchId()}' AND module_id = '${body.getModuleId()}'`;
                        let sql = `SELECT branch_id FROM m_branch_rpt WHERE branch_id = '${body.branchId}' AND module_id = '${body.moduleId}'`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve('true');
                            }
                            else {
                                resolve('false');
                            }
                        }
                        else {
                            resolve('false');
                        }
                    }
                    catch (error) {
                        reject(new Error('checkBranchId ' + error));
                    }
                });
            });
        });
    }
    function checkBranchName(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT branch_name FROM m_branch_rpt WHERE branch_name = '${body.getBranchName()}' AND module_id = '${body.getModuleId()}'`;
                        let result = yield QueryGet(sql);
                        console.log('result', result.data.recordset.length);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        }
                        else {
                            resolve(false);
                        }
                    }
                    catch (error) {
                        reject(new Error('checkBranchName ' + error));
                    }
                });
            });
        });
    }
    function checkBranchNameUpload(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log('body', body);
                        let sql;
                        if (body.info == 'updated') {
                            sql = `SELECT branch_name FROM m_branch_rpt WHERE branch_name = '${body.getBranchName()}' AND branch_id <> '${body.getBranchId()}'`;
                        }
                        else {
                            sql = `SELECT branch_name FROM m_branch_rpt WHERE branch_name = '${body.getBranchName()}'`;
                        }
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        }
                        else {
                            resolve(false);
                        }
                    }
                    catch (error) {
                        reject(new Error('checkBranchName ' + error));
                    }
                });
            });
        });
    }
    function getDataBranch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let limit = '';
                        let pagination = '';
                        let where = "WHERE module_id = '" + body.moduleId + "'";
                        let orderby;
                        if (body.filter) {
                            where += " and " + body.filter;
                        }
                        if (body.perpage) {
                            limit += body.perpage;
                        }
                        else {
                            limit += 1000;
                        }
                        if (body.page) {
                            let offset = parseInt(body.page);
                            let page = offset - 1;
                            pagination = page * limit;
                        }
                        else {
                            pagination = 0;
                        }
                        if (body.orderby == 'branchId' || body.orderby == 'branch_id') {
                            orderby = 'ORDER BY branch_id ';
                        }
                        else if (body.orderby == 'branchName' || body.orderby == 'branch_name') {
                            orderby = 'ORDER BY branch_name ';
                        }
                        else {
                            orderby = 'ORDER BY id ';
                        }
                        if (body.ordertype == 'asc' || body.ordertype == 'desc') {
                            orderby += body.ordertype;
                        }
                        else {
                            orderby += 'asc';
                        }
                        let sql = `SELECT id, branch_id as 'branchId', branch_name as 'branchName', created_user as 'createdUser',
                    created_time as 'createdTime', updated_user as 'updatedUser', updated_time as 'updatedTime' 
                    FROM m_branch_rpt ${where} ${orderby} OFFSET ${parseInt(pagination)} ROWS FETCH NEXT ${parseInt(limit)} 
                    ROWS ONLY`;
                        let sqlCount = `SELECT count(id) as 'count' FROM m_branch_rpt ${where}`;
                        let sqlFilter = `SELECT field_order as 'fieldOrder', field_name as 'fieldName', field_desc as 'fieldDesc', field_type as 'fieldType'  
                          FROM M_Menu_Filter WHERE menu_id='006'`;
                        let result = yield QueryGet(sql);
                        let resultCount = yield QueryGet(sqlCount);
                        let resultFilter = yield QueryGet(sqlFilter);
                        if (result.status == true && resultCount.status == true && resultFilter.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, responseCode: 200, data: result.data.recordset, filter: resultFilter.data.recordset, countAll: resultCount.data.recordset[0].count });
                            }
                            else {
                                resolve({ status: true, responseCode: 200, data: [], filter: resultFilter.data.recordset, countAll: resultCount.data.recordset[0].count });
                            }
                        }
                        else {
                            if (result.status == false) {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                            }
                            else if (resultCount.status == false) {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + resultCount.data.number });
                            }
                            else {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + resultFilter.data.number });
                            }
                        }
                    }
                    catch (error) {
                        reject(new Error('branchDb-getDataBranch ' + error));
                    }
                });
            });
        });
    }
    function getDataBranchInternal(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let limit = '';
                        let pagination = '';
                        let where = "WHERE 1=1";
                        let orderby;
                        if (body.moduleId) {
                            where += " and module_id = '" + body.moduleId + "'";
                        }
                        if (body.filter) {
                            where += " and " + body.filter;
                        }
                        if (body.perpage) {
                            limit += body.perpage;
                        }
                        else {
                            limit += 1000;
                        }
                        if (body.page) {
                            let offset = parseInt(body.page);
                            let page = offset - 1;
                            pagination = page * limit;
                        }
                        else {
                            pagination = 0;
                        }
                        if (body.orderby == 'branchId') {
                            orderby = 'ORDER BY branch_id ';
                        }
                        else if (body.orderby == 'branchName') {
                            orderby = 'ORDER BY branch_name ';
                        }
                        else {
                            orderby = 'ORDER BY id ';
                        }
                        if (body.ordertype == 'asc' || body.ordertype == 'desc') {
                            orderby += body.ordertype;
                        }
                        else {
                            orderby += 'asc';
                        }
                        let sql = `SELECT id, branch_id, branch_name, created_user, created_time, updated_user, updated_time 
                  FROM m_branch_rpt ${where} ${orderby} OFFSET ${parseInt(pagination)} ROWS FETCH NEXT ${parseInt(limit)} ROWS ONLY`;
                        let sqlCount = `SELECT * FROM m_branch_rpt ${where}`;
                        let sqlFilter = `SELECT field_order as 'fieldOrder', field_name as 'fieldName', field_desc as 'fieldDesc', field_type as 'fieldType'  
                        FROM M_Menu_Filter WHERE menu_id='006'`;
                        let result = yield QueryGet(sql);
                        let resultCount = yield QueryGet(sqlCount);
                        let resultFilter = yield QueryGet(sqlFilter);
                        if (result.status == true && resultCount.status == true && resultFilter.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, responseCode: 200, data: result.data.recordset, filter: resultFilter.data.recordset, countAll: resultCount.data.recordset[0].count });
                            }
                            else {
                                resolve({ status: true, responseCode: 200, data: [], filter: resultFilter.data.recordset, countAll: resultCount.data.recordset[0].count });
                            }
                        }
                        else {
                            if (result.status == false) {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                            }
                            else if (resultCount.status == false) {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + resultCount.data.number });
                            }
                            else {
                                resolve({ status: false, responseCode: 500, data: 'SQL ' + resultFilter.data.number });
                            }
                        }
                    }
                    catch (error) {
                        reject(new Error('branchDb-getDataBranchInternal ' + error));
                    }
                });
            });
        });
    }
    function getDataBranchDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT id, branch_id as 'branchId', branch_name as 'branchName', created_user as 'createdUser', created_time as 'createdTime', updated_user as 'updatedUser',
                    updated_time as 'updatedTime' FROM m_branch_rpt WHERE id = '${body.rowId}'`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, responseCode: 200, data: result.data.recordset[0] });
                            }
                            else {
                                resolve({ status: true, responseCode: 404, data: {} });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('branchDb-getDataBranchDetail ' + error));
                    }
                });
            });
        });
    }
    function getDataBranchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT id, branch_id as 'branchId', branch_name as 'branchName', created_user as 'createdUser', created_time as 'createdTime', updated_user as 'updatedUser',
                      updated_time as 'updatedTime' FROM m_branch_rpt ORDER BY id asc`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, data: result.data.recordset });
                            }
                            else {
                                resolve({ status: true, data: [] });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('branchDb-getDataBranchAll ' + error));
                    }
                });
            });
        });
    }
    function createDataBranchDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `INSERT INTO m_branch_rpt (module_id, branch_id, branch_name, created_user, created_time) 
                      OUTPUT inserted.id
                      VALUES ('${body.getModuleId()}', '${body.getBranchId()}', '${body.getBranchName()}', 
                              '${body.getUsernameToken()}','${body.getCreatedTime()}')`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: 'completed', message: 'Cabang Berhasil Ditambahkan', messageGlob: 'Branch Inserted Successfully', id: result.data.recordset[0].id });
                            }
                            else {
                                resolve({ code: 400, status: false, message: 'Konfigurasi Salah', messageGlob: 'Wrong Configuration' });
                            }
                        }
                        else {
                            if (result.data.number == 2526) {
                                resolve({ code: 406, status: false });
                            }
                            else {
                                resolve({ code: 500, status: false, message: 'SQL ' + result.data.number, messageGlob: 'SQL ' + result.data.number });
                            }
                        }
                    }
                    catch (err) {
                        reject(new Error('createDataBranchDetail ' + err));
                    }
                });
            });
        });
    }
    function updateDataBranchDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `UPDATE m_branch_rpt SET
                      branch_name = '${body.getBranchName()}',
                      updated_user = '${body.getUsernameToken()}', 
                      updated_time = '${body.getUpdatedTime()}'
                      WHERE id = '${body.getId()}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: 'completed', message: 'Cabang Berhasil Diperbarui', messageGlob: 'Branch Updated Successfully' });
                            }
                            else {
                                resolve({ code: 400, status: false, message: 'Konfigurasi Salah', messageGlob: 'Wrong Configuration' });
                            }
                        }
                        else {
                            resolve({ code: 500, status: false, message: 'SQL ' + result.data.number, messageGlob: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('branchDb-updateDataBranchDetail ' + error));
                    }
                });
            });
        });
    }
    function updateDataBranchUpload(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `UPDATE m_branch_rpt SET
                      branch_name = '${body.getBranchName()}',
                      updated_user = '${body.getUsernameToken()}', 
                      updated_time = '${body.getUpdatedTime()}'
                      WHERE branch_id = '${body.getBranchId()}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: 'completed', message: 'Cabang Berhasil Diperbarui', messageGlob: 'Branch Updated Successfully' });
                            }
                            else {
                                resolve({ code: 400, status: false, message: 'Konfigurasi Salah', messageGlob: 'Wrong Configuration' });
                            }
                        }
                        else {
                            resolve({ code: 500, status: false, message: 'SQL ' + result.data.number, messageGlob: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('branchDb-updateDataBranchDetail ' + error));
                    }
                });
            });
        });
    }
    function checkBeforeDelete(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const id = body.rowId.toString().replace(/,/gi, "','");
                        const sqlGetBranch = `select branch_id as 'branchId' from m_branch_rpt WHERE id in ('${id}')`;
                        let result = yield QueryGet(sqlGetBranch);
                        if (result.data.recordset.length > 0) {
                            let message = 'OK';
                            let dataError = [];
                            let dataErro = yield Promise.all(result.data.recordset.map((data) => __awaiter(this, void 0, void 0, function* () {
                                const sqlCheck = `select * from m_user_branch_rpt WHERE branch_id = '${data.branchId}'`;
                                let resultCheck = yield QueryGet(sqlCheck);
                                if (resultCheck.data.recordset.length > 0) {
                                    const lookupError2 = "SELECT err_desc_locl as 'local', err_desc_glob as 'global' FROM m_errcode WHERE err_code = 'B003'";
                                    let resultLookup2 = yield QueryGet(lookupError2);
                                    const err = {
                                        branchId: data.branchId,
                                        locl: resultLookup2.data.recordset[0].local,
                                        glob: resultLookup2.data.recordset[0].global
                                    };
                                    message = "NOT OK";
                                    dataError.push(err);
                                    return err;
                                }
                                else {
                                    message = "OK";
                                    return {};
                                }
                            })));
                            if (message == 'OK') {
                                resolve({ status: true, data: message });
                            }
                            else {
                                resolve({ status: false, data: dataError });
                            }
                        }
                        else {
                            resolve({ status: true, data: "OK" });
                        }
                    }
                    catch (error) {
                        reject(new Error('checkBeforeDelete' + error));
                    }
                });
            });
        });
    }
    function deleteDataBranchDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const id = body.rowId.toString().replace(/,/gi, "','");
                        const sql = `DELETE FROM m_branch_rpt WHERE id in ('${id}')`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            const total = body.rowId.length;
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: 'completed', message: total + ' Cabang Berhasil Dihapus', messageGlob: total + ' Branch deleted Successfully' });
                            }
                            else {
                                resolve({ code: 400, status: false, message: total + ' Cabang Gagal Dihapus', messageGlob: total + ' Branch deleted Failed' });
                            }
                        }
                        else {
                            resolve({ code: 500, status: false, message: 'SQL ' + result.data.number, messageGlob: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('deleteDataBranchDetail' + error));
                    }
                });
            });
        });
    }
    function deleteDataBranchUpload(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const id = body.branchId.toString().replace(/,/gi, "','");
                        const sql = `DELETE FROM m_branch_rpt WHERE branch_id in ('${id}')`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            // const total = body.rowId.length
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: true, message: ' Cabang Berhasil Dihapus', messageGlob: ' Branch deleted Successfully' });
                            }
                            else {
                                resolve({ code: 400, status: false, message: ' Cabang Gagal Dihapus', messageGlob: ' Branch deleted Failed' });
                            }
                        }
                        else {
                            resolve({ code: 500, status: false, message: 'SQL ' + result.data.number, messageGlob: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('deleteDataBranchUpload' + error));
                    }
                });
            });
        });
    }
    function deleteDataBranchDetailInternal(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const sql = `DELETE FROM m_branch_rpt WHERE id = ${body.id}`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: 'completed', message: 'Cabang Berhasil Dihapus', messageGlob: 'Branch deleted Successfully' });
                            }
                            else {
                                resolve({ code: 400, status: false, message: 'Cabang Gagal Dihapus', messageGlob: 'Branch deleted Failed' });
                            }
                        }
                        else {
                            resolve({ code: 500, status: false, message: 'SQL ' + result.data.number, messageGlob: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('branchDb-deleteDataBranchDetailInternal ' + error));
                    }
                });
            });
        });
    }
    function deleteDataBranchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const sql = `DELETE FROM m_branch_rpt`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            // const total = body.rowId.length
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: true, message: ' Cabang Berhasil Dihapus', messageGlob: ' Branch deleted Successfully' });
                            }
                            else {
                                resolve({ code: 400, status: false, message: ' Cabang Gagal Dihapus', messageGlob: ' Branch deleted Failed' });
                            }
                        }
                        else {
                            resolve({ code: 500, status: false, message: 'SQL ' + result.data.number, messageGlob: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('deleteDataBranchAll' + error));
                    }
                });
            });
        });
    }
}
exports.default = makeBranchDb;
