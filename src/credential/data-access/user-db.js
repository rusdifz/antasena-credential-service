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
function makeUserDb({ pool, QueryGet, QueryTransaction }) {
    return Object.freeze({
        checkDataRole,
        checkDataBranch,
        getErrorCode,
        getDataFilterUser,
        getDataUserAccess,
        getDataUserRoleSelection,
        getDataUserRoleSelected,
        getDataUserBranchSelection,
        getDataUserBranchSelected,
        checkDataUserAccess,
        createDataUserAccess,
        updateDataUserAccess,
        inputDataBranchSelected,
        deleteDataBranchNotSelected,
        inputDataRoleSelected,
        deleteDataRoleNotSelected,
        inputDataNotification,
        getListRoleNotifWorkflow,
        getDataUserBranch,
        getDataUserRoleDetail
    });
    function checkDataRole(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT username, role_id, created_user, created_time, updated_user,
                  updated_time FROM m_user_role WHERE module_id = '${body.getModuleId()}' 
                  AND username = '${body.getUsername()}' AND role_id = '${body.getRoleId()}'`;
                        let check = yield QueryGet(sql);
                        if (check.status == true) {
                            if (check.data.recordset.length > 0) {
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
                        reject(new Error('userDb - checkDataRole ' + error));
                    }
                });
            });
        });
    }
    function checkDataBranch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT 1 FROM m_user_branch_rpt WHERE module_id = '${body.getModuleId()}' 
                  AND username = '${body.getUsername()}' AND branch_id = '${body.getBranchId()}'`;
                        let check = yield QueryGet(sql);
                        if (check.status == true) {
                            if (check.data.recordset.length > 0) {
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
                        reject(new Error('userDb - checkDataBranch ' + error));
                    }
                });
            });
        });
    }
    function getErrorCode() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = "SELECT err_desc_locl as 'local', err_desc_glob as 'global' FROM m_errcode WHERE err_code = 'U001'";
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ responseCode: 406, data: result.data.recordset[0] });
                            }
                            else {
                                resolve({ responseCode: 406, data: { local: '', global: '' } });
                            }
                        }
                        else {
                            resolve({ responseCode: 500, data: { local: 'SQL ' + result.data.number, global: 'SQL ' + result.data.number } });
                        }
                    }
                    catch (error) {
                        reject(new Error('getErrorCode ' + error));
                    }
                });
            });
        });
    }
    function getDataFilterUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT field_order as 'fieldOrder', field_name as 'fieldName', field_desc as 'fieldDesc', 
                  field_type as 'fieldType' FROM M_Menu_Filter WHERE menu_id = '002'`;
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
                            resolve({ status: false, data: 'Filter Data User => SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('getDataFilterUser ' + error));
                    }
                });
            });
        });
    }
    function getDataUserAccess(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT access_view as 'view', access_create as 'create', access_update as 'update', 
                  access_delete as 'delete' FROM m_user_access WHERE module_id = '${body.moduleId}' 
                  AND username = '${body.username}'`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve({ status: true, data: result.data.recordset[0] });
                            }
                            else {
                                resolve({ status: true, data: { view: null, create: null, update: null, delete: null } });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('userDb - getDataUserAccess ' + error));
                    }
                });
            });
        });
    }
    function getDataUserRoleSelection(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT role_id as 'roleId', role_name as 'roleName' FROM m_role WHERE module_id = '${body.moduleId}'`;
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
                        reject(new Error('getDataUserRole ' + error));
                    }
                });
            });
        });
    }
    function getDataUserRoleSelected(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT mur.role_id as 'roleId', mr.role_name as 'roleName', mur.created_user as 'createdUser', 
                   mur.created_time as 'createdTime', mur.updated_user as 'updatedUser', mur.updated_time as 'updatedTime' 
                   FROM m_user_role mur LEFT JOIN m_role mr ON mur.role_id = mr.role_id and mur.module_id = mr.module_id 
                   WHERE mur.module_id = '${body.moduleId}' AND mur.username='${body.username}'`;
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
                        reject(new Error('getDataUserRole ' + error));
                    }
                });
            });
        });
    }
    function getDataUserBranchSelection(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT branch_id as 'branchId', branch_name as 'branchName' from m_branch_rpt 
                    WHERE module_id = '${body.moduleId}'`;
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
                        reject(new Error('getDataUserRole ' + error));
                    }
                });
            });
        });
    }
    function getDataUserBranchSelected(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT mubr.branch_id as 'branchId', mbr.branch_name as 'branchName', 
                    mubr.created_user as 'createdUser', mubr.created_time as 'createdTime', mubr.updated_user as 'updatedUser',
                    mubr.updated_time as 'updatedTime' FROM m_user_branch_rpt mubr LEFT JOIN m_branch_rpt mbr ON
                    mubr.branch_id = mbr.branch_id AND mubr.module_id = mbr.module_id 
                    WHERE mubr.module_id = '${body.moduleId}' AND mubr.username = '${body.username}'`;
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
                        reject(new Error('getDataUserRole ' + error));
                    }
                });
            });
        });
    }
    function checkDataUserAccess(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT * FROM m_user_access WHERE module_id = '${body.getModuleId()}' AND username = '${body.getUsername()}'`;
                        let check = yield QueryGet(sql);
                        if (check.status == true) {
                            if (check.data.recordset.length > 0) {
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
                        reject(new Error('userDb - checkDataUserAccess ' + error));
                    }
                });
            });
        });
    }
    function createDataUserAccess(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `INSERT INTO m_user_access (username, module_id, access_view, access_create, access_update, access_delete,created_time) 
                    VALUES ('${body.getUsername()}', '${body.getModuleId()}', '${body.getAccessView()}', '${body.getAccessCreate()}', 
                    '${body.getAccessUpdate()}', '${body.getAccessDelete()}', '${body.getCreatedTime()}')`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200 });
                            }
                            else {
                                resolve({ code: 400 });
                            }
                        }
                        else {
                            reject(new Error('SQL ' + result.data.number));
                        }
                    }
                    catch (error) {
                        reject(new Error('userDb - createDataUserAccess ' + error));
                    }
                });
            });
        });
    }
    function updateDataUserAccess(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `UPDATE m_user_access SET
                      access_view = '${body.getAccessView()}', 
                      access_create = '${body.getAccessCreate()}',
                      access_update = '${body.getAccessUpdate()}',
                      access_delete = '${body.getAccessDelete()}', 
                      updated_time = '${body.getUpdatedTime()}' 
                      WHERE module_id = '${body.getModuleId()}' AND username = '${body.getUsername()}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200 });
                            }
                            else {
                                resolve({ code: 400 });
                            }
                        }
                        else {
                            reject(new Error('SQL ' + result.data.number));
                        }
                    }
                    catch (error) {
                        reject(new Error('userDb - updateDataUserAccess ' + error));
                    }
                });
            });
        });
    }
    function inputDataBranchSelected(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log('masuk sini');
                        pool.connect((err) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                reject(new Error('SQL Connection ' + err));
                            }
                            const transaction = pool.transaction();
                            transaction.begin((err) => __awaiter(this, void 0, void 0, function* () {
                                const request = pool.request(transaction);
                                // const request = transaction.request()
                                if (err) {
                                    reject(new Error("SQL Connection " + err));
                                }
                                const queries = body.sql;
                                const queryLength = queries.length;
                                queries.forEach((sql, index) => {
                                    request.query(sql, (err, res) => {
                                        if (err) {
                                            transaction.rollback(err => {
                                                if (err) {
                                                    console.log('rollback input error');
                                                }
                                                else {
                                                    console.log('rollback input success');
                                                }
                                            });
                                            reject(new Error('SQL ' + err));
                                        }
                                        else {
                                            if (index + 1 == queryLength) {
                                                const id = body.id.toString().replace(/,/gi, "','");
                                                const sql2 = `DELETE FROM m_user_branch_rpt WHERE module_id = '${body.moduleId}' AND username = '${body.username}' AND branch_id not in ('${id}')`;
                                                console.log('sql2', sql2);
                                                request.query(sql2, (err, res2) => {
                                                    if (err) {
                                                        transaction.rollback(err => {
                                                            if (err) {
                                                                console.log('rollback delete error');
                                                            }
                                                            else {
                                                                console.log('rollback delete success');
                                                            }
                                                        });
                                                        resolve({ status: false, code: 400 });
                                                    }
                                                    else {
                                                        transaction.commit(err => {
                                                            if (err) {
                                                                console.log('commit delete error');
                                                            }
                                                            else {
                                                                console.log('commit delete success');
                                                            }
                                                        });
                                                        resolve({ status: 'completed', code: 200 });
                                                    }
                                                });
                                            }
                                        }
                                    });
                                });
                            }));
                        }));
                    }
                    catch (error) {
                        reject(new Error('inputDataBranchNotSelected' + error));
                    }
                });
            });
        });
    }
    function deleteDataBranchNotSelected(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const sql = `DELETE FROM m_user_branch_rpt WHERE module_id = '${body.moduleId}' AND username = '${body.username}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: true });
                            }
                            else {
                                resolve({ code: 400, status: false });
                            }
                        }
                        else {
                            reject(new Error('SQL ' + result.data.number));
                        }
                    }
                    catch (error) {
                        reject(new Error('deleteDataBranchNotSelected' + error));
                    }
                });
            });
        });
    }
    function inputDataRoleSelected(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const db = pool;
                        const transactionRole = db.transaction();
                        transactionRole.begin((err) => __awaiter(this, void 0, void 0, function* () {
                            const request = db.request(transactionRole);
                            if (err) {
                                reject(new Error("SQL Connection " + err));
                            }
                            const queries = body.sql;
                            yield queries.forEach(element => {
                                console.log('dede');
                                request.query(element, (err, res) => {
                                    if (err) {
                                        console.log('error input', err);
                                    }
                                    else {
                                        console.log('berhasil', res);
                                    }
                                });
                            });
                            const id = body.id.toString().replace(/,/gi, "','");
                            const sql = `DELETE FROM m_user_role WHERE module_id = '${body.moduleId}' AND username = '${body.username}' AND role_id not in ('${id}')`;
                            yield request.query(sql, (err, results) => __awaiter(this, void 0, void 0, function* () {
                                if (err) {
                                    yield transactionRole.rollback(err => {
                                        if (err) {
                                            console.log('rollback error');
                                        }
                                        else {
                                            console.log('rollback success');
                                        }
                                    });
                                    console.log('err', err);
                                    // reject(new Error("SQL " + err.number));
                                    resolve({ code: 400, status: false, data: err.number });
                                }
                                else {
                                    yield transactionRole.commit(err => {
                                        if (err) {
                                            console.log('commit error');
                                        }
                                        else {
                                            console.log('commit success');
                                        }
                                    });
                                    resolve({ code: 200, status: true });
                                }
                                console.log('Query', sql);
                            }));
                        }));
                    }
                    catch (error) {
                        reject(new Error('inputDataBranchNotSelected' + error));
                    }
                });
            });
        });
    }
    function deleteDataRoleNotSelected(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const sql = `DELETE FROM m_user_role WHERE module_id = '${body.moduleId}' AND username = '${body.username}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: true });
                            }
                            else {
                                resolve({ code: 400, status: false });
                            }
                        }
                        else {
                            reject(new Error('SQL ' + result.data.number));
                        }
                    }
                    catch (error) {
                        reject(new Error('deleteDataRoleNotSelected' + error));
                    }
                });
            });
        });
    }
    function inputDataNotification(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `INSERT INTO m_notification (module_id, username, datetime, title, title_glob, message, message_glob, status, created_user, created_time) 
                  VALUES ('${body.getModuleId()}', '${body.getUsername()}', '${body.getDatetime()}', '${body.getTitle()}', '${body.getTitleGlob()}', 
                          '${body.getMessage()}', '${body.getMessageGlob()}', ${body.getStatus()}, '${body.getUsername()}', '${body.getCreatedTime()}')`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200 });
                            }
                            else {
                                resolve({ code: 400 });
                            }
                        }
                        else {
                            resolve({ code: 500, data: 'SQL ' + result.data.number });
                            console.log('resu', result.data);
                        }
                    }
                    catch (error) {
                        reject(new Error('userDb - inputDataNotification ' + error));
                    }
                });
            });
        });
    }
    function getListRoleNotifWorkflow() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sqlChk = `SELECT * FROM m_user_role WHERE role_id LIKE '%CHK%'`;
                        let resultChk = yield QueryGet(sqlChk);
                        let dataRole = [];
                        if (resultChk.data.recordset.length > 0) {
                            yield resultChk.data.recordset.map(data => {
                                dataRole.push(data);
                            });
                        }
                        resolve(dataRole);
                    }
                    catch (error) {
                        reject(new Error('userDb - getListRoleNotifWorkflow ' + error));
                    }
                });
            });
        });
    }
    function getDataUserBranch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT m_user_branch_rpt.branch_id, m_branch_rpt.branch_name FROM m_user_branch_rpt 
                  LEFT JOIN m_branch_rpt ON m_user_branch_rpt.branch_id = m_branch_rpt.branch_id WHERE m_user_branch_rpt.username = '${body.username}'`;
                        let result = yield QueryGet(sql);
                        if (result.data.recordset.length > 0) {
                            const datares = yield Promise.all(result.data.recordset.map(data => {
                                const branch = {
                                    branchId: data.branch_id,
                                    branchName: data.branch_name
                                };
                                return branch;
                            }));
                            resolve({ code: true, data: datares });
                        }
                        else {
                            resolve({ code: false, data: [] });
                        }
                    }
                    catch (error) {
                        reject(new Error('getDataUserBranch ' + error));
                    }
                });
            });
        });
    }
    function getDataUserRoleDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT m_user_role.role_id, m_role.role_name FROM m_user_role 
                    LEFT JOIN m_role ON m_user_role.role_id = m_role.role_id WHERE m_user_role.username = '${body.username}'`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                const datares = yield Promise.all(result.data.recordset.map(data => {
                                    const role = {
                                        roleId: data.role_id,
                                        roleName: data.role_name
                                    };
                                    return role;
                                }));
                                // console.log('data role', datares);
                                resolve({ status: true, data: datares });
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
                        reject(new Error('getDataUserRoleDetail ' + error));
                    }
                });
            });
        });
    }
}
exports.default = makeUserDb;
