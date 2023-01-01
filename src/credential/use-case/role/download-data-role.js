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
function makeDownloadDataRole({ roleDb, ExcelJs, moment }) {
    return function downloadDataRole(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getRoleDb = yield roleDb.downloadRole();
                let result;
                if (getRoleDb.status == true) {
                    const dataRole = yield Promise.all(getRoleDb.map(data => {
                        let updatedTime;
                        if (data.updated_time == null) {
                            updatedTime = null;
                        }
                        else {
                            updatedTime = moment(data.updated_time).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                        }
                        const role = {
                            id: data.id,
                            role_id: data.role_id,
                            role_name: data.role_name,
                            created_user: data.created_user,
                            created_time: moment(data.created_time).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                            updated_user: data.updated_user,
                            updated_time: updatedTime
                        };
                        return role;
                    }));
                    const workbook = new ExcelJs.Workbook(); //creating workbook
                    const worksheet = workbook.addWorksheet('Data Role'); //creating worksheet
                    //  WorkSheet Header
                    const kolom = [
                        { header: 'Role Id', key: 'role_id', width: 15 },
                        { header: 'Role Name', key: 'role_name', width: 25 },
                        { header: 'Created User', key: 'created_user', width: 25 },
                        { header: 'Created Time', key: 'created_time', width: 20 },
                        { header: 'Updated User', key: 'updated_user', width: 25 },
                        { header: 'Updated Time', key: 'updated_time', width: 20 }
                    ];
                    worksheet.columns = kolom;
                    worksheet.addRows(dataRole);
                    worksheet.getRow(1).eachCell((cell) => {
                        cell.font = { bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    });
                    const basedir = __dirname;
                    const fileDir = basedir.toString().replace(/role/, "file/");
                    const filename = 'role.xlsx';
                    const writefile = yield workbook.xlsx.writeFile(fileDir + filename);
                    result = { status: true, data: filename };
                    // result = await workbook.xlsx.writeBuffer()
                }
                else {
                    result = getRoleDb;
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-downloadDataRole ' + error);
            }
        });
    };
}
exports.default = makeDownloadDataRole;
