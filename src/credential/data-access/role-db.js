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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
moment_timezone_1.default.locale('id');
let transactionMapping;
function makeRoleDb({ pool, QueryGet, QueryTransaction }) {
    return Object.freeze({
        validasiRole,
        checkDataMenu,
        checkDataUpdateSame,
        downloadRole,
        getErrorCode,
        getDataRole,
        getDataRoleInternal,
        getDataRoleDetail,
        getDataRoleMappingDetail,
        getDataRoleMenuOptionParent,
        getDataRoleMenuOptionChild,
        getDataRoleMenuSelection,
        getDataMenuNew,
        createDataRoleDetail,
        updateDataRoleDetail,
        checkBeforeDelete,
        deleteDataRoleDetail,
        deleteDataRoleDetailInternal,
        inputDataRoleMapping,
        deleteDataRoleNotMapping
    });
    function validasiRole(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const sqlCheckName = `SELECT role_name FROM m_role WHERE role_name = '${body.getRoleName()}' AND module_id = '${body.getModuleId()}'`;
                        const sqlCheckId = `SELECT role_id FROM m_role WHERE role_id = '${body.getRoleId()}' AND module_id = '${body.getModuleId()}'`;
                        const lookupErrorId = "SELECT err_desc_locl as 'local', err_desc_glob as 'global' FROM m_errcode WHERE err_code = 'R001'";
                        const lookupErrorName = "SELECT err_desc_locl as 'local', err_desc_glob as 'global' FROM m_errcode WHERE err_code = 'R002'";
                        let datasend;
                        if (body.info == 'update') {
                            let checkName = yield QueryGet(sqlCheckName);
                            if (checkName.status == true) {
                                if (checkName.data.recordset.length > 0) {
                                    const getErrorCode = yield QueryGet(lookupErrorName);
                                    datasend = {
                                        status: false,
                                        responseCode: 406,
                                        data: {
                                            locl: getErrorCode.data.recordset[0].local,
                                            glob: getErrorCode.data.recordset[0].global
                                        }
                                    };
                                }
                                else {
                                    datasend = { status: true, data: "OK" };
                                }
                            }
                            else {
                                datasend = {
                                    status: false,
                                    responseCode: 500,
                                    data: {
                                        locl: 'SQL ' + checkName.data.number,
                                        glob: 'SQL ' + checkName.data.number
                                    }
                                };
                            }
                        }
                        else {
                            let checkId = yield QueryGet(sqlCheckId);
                            if (checkId.status == true) {
                                if (checkId.data.recordset.length > 0) {
                                    const getErrorCode = yield QueryGet(lookupErrorId);
                                    datasend = {
                                        status: false,
                                        responseCode: 406,
                                        data: {
                                            locl: getErrorCode.data.recordset[0].local,
                                            glob: getErrorCode.data.recordset[0].global
                                        }
                                    };
                                }
                                else {
                                    let checkName = yield QueryGet(sqlCheckName);
                                    if (checkName.status == true) {
                                        if (checkName.data.recordset.length > 0) {
                                            const getErrorCode = yield QueryGet(lookupErrorName);
                                            datasend = {
                                                status: false,
                                                responseCode: 406,
                                                data: {
                                                    locl: getErrorCode.data.recordset[0].local,
                                                    glob: getErrorCode.data.recordset[0].global
                                                }
                                            };
                                        }
                                        else {
                                            datasend = { status: true, data: "OK" };
                                        }
                                    }
                                    else {
                                        datasend = {
                                            status: false,
                                            responseCode: 500,
                                            data: {
                                                locl: 'SQL ' + checkName.data.number,
                                                glob: 'SQL ' + checkName.data.number
                                            }
                                        };
                                    }
                                }
                            }
                            else {
                                datasend = {
                                    status: false,
                                    responseCode: 500,
                                    data: {
                                        locl: 'SQL ' + checkId.data.number,
                                        glob: 'SQL ' + checkId.data.number
                                    }
                                };
                            }
                        }
                        resolve(datasend);
                    }
                    catch (error) {
                        reject(new Error('validasiRole ' + error));
                    }
                });
            });
        });
    }
    function checkDataMenu(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT 1 checking FROM m_role_menu mrm LEFT JOIN m_menu mm ON
                  mrm.menu_id = mm.menu_id WHERE EXISTS (SELECT 1 FROM (SELECT module_id, 
                  role_id from m_role mr where id = '${body.getId()}') mr WHERE mr.module_id = mrm.module_id 
                  AND mr.role_id = mrm.role_id) AND mm.menu_id = '${body.getMenuId()}'`;
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
                        reject(new Error('checkRoleId ' + error));
                    }
                });
            });
        });
    }
    function checkDataUpdateSame(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let where = `WHERE EXISTS (SELECT 1 FROM (SELECT module_id, role_id from m_role mr where id = '${body.getId()}') mr 
                      WHERE mr.module_id = mrm.module_id AND mr.role_id = mrm.role_id) 
                      AND mrm.selected = '${body.getSelected()}' AND mrm.menu_id = '${body.getMenuId()}' `;
                        if (body.getAccessCreate() == null) {
                            where += 'AND mrm.access_create is null ';
                        }
                        else {
                            where += `AND mrm.access_create = ${body.getAccessCreate()} `;
                        }
                        if (body.getAccessUpdate() == null) {
                            where += 'AND mrm.access_update is null ';
                        }
                        else {
                            where += `AND mrm.access_update = ${body.getAccessUpdate()} `;
                        }
                        if (body.getAccessDelete() == null) {
                            where += 'AND mrm.access_delete is null ';
                        }
                        else {
                            where += `AND mrm.access_delete = ${body.getAccessDelete()} `;
                        }
                        if (body.getAccessView() == null) {
                            where += 'AND mrm.access_view is null ';
                        }
                        else {
                            where += `AND mrm.access_view = ${body.getAccessView()} `;
                        }
                        let sql = `SELECT * FROM m_role_menu mrm LEFT JOIN m_menu mm ON mrm.menu_id = mm.menu_id ${where}`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                resolve(false);
                            }
                            else {
                                resolve(true);
                            }
                        }
                        else {
                            resolve(true);
                        }
                    }
                    catch (error) {
                        reject(new Error('checkDataUpdateSame ' + error));
                    }
                });
            });
        });
    }
    function downloadRole() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT id, role_id, role_name, created_user, created_time, updated_user, updated_time 
                  FROM m_role ORDER BY id asc`;
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
                        reject(new Error('downloadRole ' + error));
                    }
                });
            });
        });
    }
    function getErrorCode(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log('body', body);
                        let errCode;
                        if (body.info == 'waiting') {
                            errCode = 'R005';
                        }
                        else if (body.info == 'false id') {
                            errCode = 'R006';
                        }
                        else if (body.info == 'false delete workflow') {
                            errCode = 'R008';
                        }
                        else {
                            errCode = 'R007';
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
    function getDataRole(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let limit = '';
                        let pagination = '';
                        let where = "WHERE module_id = '" + body.moduleId + "' ";
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
                        let orderBy = body.orderby;
                        if (orderBy == 'roleId') {
                            orderby = 'ORDER BY role_id ';
                        }
                        else if (orderBy == 'roleName') {
                            orderby = 'ORDER BY role_name ';
                        }
                        else if (orderBy == 'createdUser') {
                            orderby = 'ORDER BY created_user ';
                        }
                        else if (orderBy == 'updatedUser') {
                            orderby = 'ORDER BY updated_user ';
                        }
                        else if (orderBy == 'createdTime') {
                            orderby = 'ORDER BY created_time ';
                        }
                        else if (orderBy == 'updatedTime') {
                            orderby = 'ORDER BY updated_time ';
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
                        let sql = `SELECT id, role_id as 'roleId', role_name as 'roleName', created_user as 'createdUser', created_time as 'createdTime', 
                  updated_user as 'updatedUser', updated_time as 'updatedTime' FROM m_role ${where} 
                  ${orderby} OFFSET ${parseInt(pagination)} ROWS FETCH NEXT ${parseInt(limit)} ROWS ONLY`;
                        let sqlCount = `SELECT COUNT(id) as 'count' FROM m_role ${where}`;
                        let sqlFilter = `SELECT field_order as 'fieldOrder', field_name as 'fieldName', field_desc as 'fieldDesc', field_type as 'fieldType' 
                         FROM M_Menu_Filter WHERE menu_id='005'`;
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
                        reject(new Error('roleDb-getDataRole ' + error));
                    }
                });
            });
        });
    }
    function getDataRoleInternal(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let limit = '';
                        let pagination = '';
                        let orderby;
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
                        if (body.ordertype == 'asc' || body.ordertype == 'desc') {
                            orderby += body.ordertype;
                        }
                        else {
                            orderby += 'asc';
                        }
                        let sql;
                        let sqlCount;
                        let where = "WHERE 1=1";
                        if (body.menuId) {
                            where += " and mrm.menu_id = '" + body.menuId + "' ";
                            if (body.moduleId) {
                                where += " and mr.module_id = '" + body.moduleId + "' ";
                            }
                            if (body.orderby == 'roleId') {
                                orderby = 'ORDER BY mr.role_id ';
                            }
                            else if (body.orderby == 'roleName') {
                                orderby = 'ORDER BY mr.role_name ';
                            }
                            else if (body.orderby == 'createdUser') {
                                orderby = 'ORDER BY mr.created_user ';
                            }
                            else if (body.orderby == 'updatedUser') {
                                orderby = 'ORDER BY mr.updated_user ';
                            }
                            else if (body.orderby == 'createdTime') {
                                orderby = 'ORDER BY mr.created_time ';
                            }
                            else if (body.orderby == 'updatedTime') {
                                orderby = 'ORDER BY mr.updated_time ';
                            }
                            else {
                                orderby = 'ORDER BY mr.id ';
                            }
                            sql = `SELECT mr.id, mr.role_id, mr.role_name, mr.created_user, mr.created_time, mr.updated_user, mr.updated_time 
                    FROM m_role mr LEFT JOIN m_role_menu mrm ON mr.role_id = mrm.role_id 
                    ${where} ${orderby} OFFSET ${parseInt(pagination)} ROWS FETCH NEXT ${parseInt(limit)} ROWS ONLY`;
                            sqlCount = `SELECT COUNT(mr.id) as 'count' FROM m_role mr LEFT JOIN m_role_menu mrm ON mr.role_id = mrm.role_id ${where}`;
                        }
                        else {
                            if (body.moduleId) {
                                where += " and module_id = '" + body.moduleId + "' ";
                            }
                            if (body.orderby == 'roleId') {
                                orderby = 'ORDER BY role_id ';
                            }
                            else if (body.orderby == 'roleName') {
                                orderby = 'ORDER BY role_name ';
                            }
                            else if (body.orderby == 'createdUser') {
                                orderby = 'ORDER BY created_user ';
                            }
                            else if (body.orderby == 'updatedUser') {
                                orderby = 'ORDER BY updated_user ';
                            }
                            else if (body.orderby == 'createdTime') {
                                orderby = 'ORDER BY created_time ';
                            }
                            else if (body.orderby == 'updatedTime') {
                                orderby = 'ORDER BY updated_time ';
                            }
                            else {
                                orderby = 'ORDER BY id ';
                            }
                            sql = `SELECT id, role_id, role_name, created_user, created_time, updated_user, updated_time 
                    FROM m_role ${where} ${orderby} OFFSET ${parseInt(pagination)} ROWS FETCH NEXT ${parseInt(limit)} ROWS ONLY`;
                            sqlCount = `SELECT COUNT(id) as 'count' FROM m_role ${where}`;
                        }
                        const sqlFilter = `SELECT field_order as 'fieldOrder', field_name as 'fieldName', field_desc as 'fieldDesc', field_type as 'fieldType' 
                            FROM M_Menu_Filter WHERE menu_id='005'`;
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
                        reject(new Error('roleDb-getDataRoleInternal ' + error));
                    }
                });
            });
        });
    }
    function getDataRoleDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const id = body.rowId;
                        let sql = `SELECT id, role_id as 'roleId', role_name as 'roleName', created_user as 'createdUser', created_time as 'createdTime', 
                  updated_user as 'updatedUser', updated_time as 'updatedTime' FROM m_role WHERE id = '${id}'`;
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
                        reject(new Error('roleDb-getDataRoleDetail ' + error));
                    }
                });
            });
        });
    }
    function getDataRoleMappingDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log('dss', body);
                        let sql;
                        if (body.menuId) {
                            sql = `SELECT mm.menu_id as 'menuId', mm.menu_icon as 'menuIcon', mm.menu_desc as 'menuDesc', mm.menu_desc_glob as 'menuDescGlob', 
                access_view as 'accessView', access_create as 'accessCreate', access_update as 'accessUpdate', access_delete as 'accessDelete',
                mrm.created_user as 'createdUser', mrm.created_time as 'createdTime', mrm.updated_user as 'updatedUser',
                mrm.updated_time as 'updatedTime', CASE WHEN mrm.selected = 1 THEN 'yes' WHEN
                mrm.selected = 0 THEN 'no' ELSE 'inc' END selected FROM m_role_menu mrm LEFT JOIN m_menu mm ON
                mrm.menu_id = mm.menu_id WHERE mrm.selected!=0 AND EXISTS
                (SELECT 1 FROM (SELECT module_id, role_id FROM m_role mr WHERE id = ${body.id}) mr WHERE
                mr.module_id = mrm.module_id AND mr.role_id = mrm.role_id) AND mrm.menu_id = '${body.menuId}'`;
                        }
                        else {
                            sql = `SELECT role_id as 'roleId', role_name as 'roleName', updated_time as 'time' FROM m_role_menu WHERE EXISTS (SELECT 1 FROM (SELECT module_id, role_id
                  FROM m_role mr WHERE id = ${body.id}) mr WHERE mr.module_id = m_role_menu.module_id AND
                  mr.role_id = m_role_menu.role_id)`;
                        }
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
                        reject(new Error('roleDb-getDataRoleMappingDetail ' + error));
                    }
                });
            });
        });
    }
    function getDataRoleMenuOptionParent(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let id = " '" + body.moduleId + "' ";
                        let sql = `SELECT menu_id as 'menuId', menu_icon as 'menuIcon', menu_desc as 'menuDesc', menu_desc_glob as 'menuDescGlob', 
                  menu_type as 'menuType', menu_parent as 'menuParent', menu_url as 'menuUrl' FROM m_menu 
                  WHERE module_id = ${id} AND disabled_status = 0 AND menu_parent = '' ORDER BY menu_order`;
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
                        // if(result.recordset.length > 0){
                        //   resolve(result.recordset)
                        // }else{
                        //   resolve([]);
                        // }
                    }
                    catch (error) {
                        reject(new Error('getDataRoleMenuOptionParent ' + error));
                    }
                });
            });
        });
    }
    function getDataRoleMenuOptionChild(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let insert = {
                            id: body.moduleId,
                            parent: body.menuId
                        };
                        let sql = `SELECT menu_id as 'menuId', menu_icon as 'menuIcon', menu_desc as 'menuDesc', menu_desc_glob as 'menuDescGlob', 
                  menu_type as 'menuType', menu_parent as 'menuParent', menu_url as 'menuUrl' FROM m_menu WHERE module_id = '${insert.id}' 
                  AND disabled_status = 0 AND menu_parent = '${insert.parent}' ORDER BY menu_order`;
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
                        // if(result.recordset.length > 0){
                        //   resolve(result.recordset)
                        // }else{
                        //   resolve([]);
                        // }
                    }
                    catch (error) {
                        reject(new Error('getDataRoleMenuOptionChild ' + error));
                    }
                });
            });
        });
    }
    function getDataRoleMenuSelection(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let id = body.id;
                        let sql = `SELECT mm.menu_id as 'menuId', mm.menu_icon as 'menuIcon', mm.menu_desc as 'menuDesc', mm.menu_desc_glob as 'menuDescGlob', 
                  access_view as 'accessView', access_create as 'accessCreate', access_update as 'accessUpdate', access_delete as 'accessDelete',
                  mrm.created_user as 'createdUser', mrm.created_time as 'createdTime', mrm.updated_user as 'updatedUser',
                  mrm.updated_time as 'updatedTime', CASE WHEN mrm.selected = 1 THEN 'yes' WHEN
                  mrm.selected = 0 THEN 'no' ELSE 'inc' END selected FROM m_role_menu mrm LEFT JOIN m_menu mm ON
                  mrm.menu_id = mm.menu_id WHERE mrm.selected!=0 AND EXISTS
                  (SELECT 1 FROM (SELECT module_id, role_id FROM m_role mr WHERE id = ${id}) mr WHERE
                  mr.module_id = mrm.module_id AND mr.role_id = mrm.role_id) ORDER BY mm.menu_order`;
                        let result = yield QueryGet(sql);
                        if (result.status == true) {
                            if (result.data.recordset.length > 0) {
                                const data = yield Promise.all(result.data.recordset.map(role => {
                                    const createdTime = (0, moment_timezone_1.default)(role.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    let updatedTime;
                                    if (role.updatedTime == null) {
                                        updatedTime = null;
                                    }
                                    else {
                                        updatedTime = (0, moment_timezone_1.default)(role.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                    }
                                    delete role.createdTime;
                                    delete role.updatedTime;
                                    role.createdTime = createdTime;
                                    role.updatedTime = updatedTime;
                                    return role;
                                }));
                                resolve({ status: true, data: data });
                            }
                            else {
                                resolve({ status: true, data: [] });
                            }
                        }
                        else {
                            resolve({ status: false, responseCode: 500, data: 'SQL ' + result.data.number });
                        }
                        // if(result.recordset.length > 0){
                        //   resolve(data)
                        // }else{
                        //   resolve([]);
                        // }
                    }
                    catch (error) {
                        reject(new Error('roleDb - getDataRoleMenuSelection ' + error));
                    }
                });
            });
        });
    }
    function getDataMenuNew(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `SELECT menu_icon as 'menuIcon', menu_desc as 'menuDesc', menu_desc_glob as 'menuDescGlob' FROM m_menu 
                  WHERE menu_id = '${body.menuId}'`;
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
                        // if(result.recordset.length > 0){
                        //   resolve({code: true, data: result.recordset[0]})
                        // }else{
                        //   resolve({code: false, data: {menuIcon:'', menuDesc:'', menuDescGlob:''}});
                        // }
                    }
                    catch (error) {
                        reject(new Error('roleDb-getDataRoleMappingDetail ' + error));
                    }
                });
            });
        });
    }
    function createDataRoleDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `INSERT INTO m_role (module_id, role_id, role_name, created_user, created_time)
                  OUTPUT inserted.id
                  VALUES ('${body.getModuleId()}', 
                          '${body.getRoleId()}', 
                          '${body.getRoleName()}', 
                          '${body.getUsernameToken()}', 
                          '${body.getCreatedTime()}')`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: 'completed', message: 'Role Berhasil Ditambahkan', messageGlob: 'Role Inserted Successfully', id: result.data.recordset[0].id });
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
                        reject(new Error('createDataRoleDetail ' + error));
                    }
                });
            });
        });
    }
    function updateDataRoleDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let sql = `UPDATE m_role SET 
                    role_name = '${body.getRoleName()}', 
                    updated_user = '${body.getUsernameToken()}',
                    updated_time = '${body.getUpdatedTime()}' 
                    where id = '${body.getId()}'`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: 'completed', message: 'Role Berhasil Diperbarui', messageGlob: 'Role Updated Successfully' });
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
                        reject(new Error('updateDataRoleDetail ' + error));
                    }
                });
            });
        });
    }
    function inputDataRoleMapping(body) {
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
                            // console.log('quer', queries);
                            yield queries.forEach(element => {
                                request.query(element, (err, res) => {
                                    if (err) {
                                        console.log('error input', err);
                                    }
                                    else {
                                        console.log('berhasil input', res);
                                    }
                                });
                                // console.log('sql', element);
                            });
                            const id = body.id.toString().replace(/,/gi, "','");
                            const sql = `DELETE FROM m_role_menu where module_id = '${body.moduleId}' AND role_id = '${body.roleId}' and menu_id not in ('${id}')`;
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
                                    resolve({ code: 200, status: 'completed' });
                                }
                                // console.log('Query', sql);          
                            }));
                        }));
                    }
                    catch (error) {
                        reject(new Error('inputDataRoleMapping' + error));
                    }
                });
            });
        });
    }
    function deleteDataRoleNotMapping(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        transactionMapping = pool.transaction();
                        transactionMapping.begin((err) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                reject(new Error("SQL Connection " + err));
                            }
                            const request = transactionMapping.request();
                            let sql = `DELETE FROM m_role_menu where module_id = '${body.moduleId}' AND role_id = '${body.roleId}'`;
                            yield request.query(sql, (err, results) => __awaiter(this, void 0, void 0, function* () {
                                if (err) {
                                    transactionMapping.rollback(err => {
                                        if (err) {
                                            console.log('rollback error');
                                        }
                                        else {
                                            console.log('rollback success');
                                        }
                                    });
                                    reject(new Error("SQL " + err.number));
                                }
                                else {
                                    transactionMapping.commit(err => {
                                        if (err) {
                                            console.log('commit error');
                                        }
                                        else {
                                            console.log('commit success');
                                        }
                                    });
                                    if (results.rowsAffected > 0) {
                                        resolve({ code: 200, status: true });
                                    }
                                    else {
                                        resolve({ code: 400, status: false });
                                    }
                                }
                                console.log('Query', sql);
                            }));
                        }));
                    }
                    catch (error) {
                        reject(new Error('deleteDataRoleNotMapping ' + error));
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
                        const sql = `select role_id as 'roleId' from m_role WHERE id in ('${id}')`;
                        let result = yield QueryGet(sql);
                        if (result.data.recordset.length > 0) {
                            let dataError = [];
                            let message;
                            let dataerr = yield Promise.all(yield result.data.recordset.map((data) => __awaiter(this, void 0, void 0, function* () {
                                console.log('mapping');
                                const sqlCheck = `select * from m_user_role WHERE role_id = '${data.roleId}'`;
                                let resultCheck = yield QueryGet(sqlCheck);
                                if (resultCheck.data.recordset.length > 0) {
                                    const lookupError = "SELECT err_desc_locl as 'local', err_desc_glob as 'global' FROM m_errcode WHERE err_code = 'R003'";
                                    let resultLookup = yield QueryGet(lookupError);
                                    const err = {
                                        roleId: data.roleId,
                                        locl: resultLookup.data.recordset[0].local,
                                        glob: resultLookup.data.recordset[0].global
                                    };
                                    dataError.push(err);
                                    message = "NOT OK";
                                }
                                else {
                                    const sqlCheckMenu = `select * from m_role_menu WHERE role_id = '${data.roleId}'`;
                                    let resultCheckMenu = yield QueryGet(sqlCheckMenu);
                                    if (resultCheckMenu.data.recordset.length > 0) {
                                        const lookupError = "SELECT err_desc_locl as 'local', err_desc_glob as 'global' FROM m_errcode WHERE err_code = 'R004'";
                                        let resultLookup = yield QueryGet(lookupError);
                                        const err = {
                                            roleId: data.roleId,
                                            locl: resultLookup.data.recordset[0].local,
                                            glob: resultLookup.data.recordset[0].global
                                        };
                                        dataError.push(err);
                                        message = "NOT OK";
                                    }
                                    else {
                                        message = "OK";
                                    }
                                }
                                return data;
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
    function deleteDataRoleDetail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const id = body.rowId.toString().replace(/,/gi, "','");
                        const sql = `DELETE FROM m_role WHERE id in ('${id}')`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            const total = body.rowId.length;
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: 'completed', message: total + ' Role Berhasil Dihapus', messageGlob: total + ' Role Deleted Successfully' });
                            }
                            else {
                                resolve({ code: 400, status: false, message: total + ' Role Gagal Dihapus', messageGlob: total + ' Role Deleted Failed' });
                            }
                        }
                        else {
                            resolve({ code: 500, status: false, message: 'SQL ' + result.data.number, messageGlob: 'SQL ' + result.data.number });
                        }
                    }
                    catch (error) {
                        reject(new Error('deleteDataRole' + error));
                    }
                });
            });
        });
    }
    function deleteDataRoleDetailInternal(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const sql = `DELETE FROM m_role WHERE id = ${body.id}`;
                        let result = yield QueryTransaction(sql);
                        if (result.status == true) {
                            if (result.data.rowsAffected > 0) {
                                resolve({ code: 200, status: 'completed', message: 'Role Berhasil Dihapus', messageGlob: 'Role Deleted Successfully' });
                            }
                            else {
                                resolve({ code: 400, status: false, message: 'Konfigurasi Salah', messageGlob: 'Wrong Configuration' });
                            }
                        }
                        else {
                            reject(new Error('SQL ' + result.data.number));
                        }
                    }
                    catch (error) {
                        reject(new Error('deleteDataRole' + error));
                    }
                });
            });
        });
    }
}
exports.default = makeRoleDb;
