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
function makeDownloadDataUserDetailRole({ userDb, internalServer, ExcelJs, moment }) {
    return function downloadDataUserDetailRole(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUser = yield internalServer.getMasterUser(body);
                const getUserAccess = yield userDb.getDataUserAccess(body);
                let result;
                if (getUserAccess.status == true) {
                    let user = [];
                    if (getUser.data.users.length > 0) {
                        yield getUser.data.users.map(data => {
                            if (data.username == body.username) {
                                let updatedTime;
                                if (data.updatedTime == null) {
                                    updatedTime = null;
                                }
                                else {
                                    updatedTime = moment(data.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                                }
                                const dataUser = {
                                    username: data.username,
                                    email: data.email,
                                    fullname: data.fullname,
                                    view: getUserAccess.data.view,
                                    create: getUserAccess.data.create,
                                    update: getUserAccess.data.update,
                                    delete: getUserAccess.data.delete,
                                    createdTime: moment(data.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                                    createdUser: data.createdUser,
                                    updatedTime: updatedTime,
                                    updatedUser: data.updatedUser
                                };
                                user.push(dataUser);
                            }
                        });
                    }
                    else {
                        const dataUser = {
                            username: null,
                            email: null,
                            fullname: null,
                            view: getUserAccess.data.view,
                            create: getUserAccess.data.create,
                            update: getUserAccess.data.update,
                            delete: getUserAccess.data.delete,
                            createdTime: null,
                            createdUser: null,
                            updatedTime: null,
                            updatedUser: null
                        };
                        user.push(dataUser);
                    }
                    const workbook = new ExcelJs.Workbook(); //creating workbook
                    const worksheet = workbook.addWorksheet('Data User Role'); //creating worksheet
                    //  WorkSheet Header
                    const kolom = [
                        { header: 'Username', key: 'username', width: 25 },
                        { header: 'Email', key: 'email', width: 25 },
                        { header: 'Fullname', key: 'fullname', width: 25 },
                        { header: 'Access View', key: 'view', width: 15 }, ,
                        { header: 'Access Create', key: 'create', width: 15 },
                        { header: 'Access Update', key: 'update', width: 15 },
                        { header: 'Access Delete', key: 'delete', width: 15 },
                        { header: 'Created User', key: 'createdUser', width: 25 },
                        { header: 'Created Time', key: 'createdTime', width: 20 },
                        { header: 'Updated User', key: 'updatedUser', width: 25 },
                        { header: 'Updated Time', key: 'updatedTime', width: 20 }
                    ];
                    worksheet.columns = kolom;
                    worksheet.addRows(user);
                    worksheet.getRow(1).eachCell((cell) => {
                        cell.font = { bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    });
                    const filename = 'user role.xlsx';
                    const writefile = yield workbook.xlsx.writeFile('src/credential/file/' + filename);
                    result = { status: true, data: filename };
                    // const result = await workbook.xlsx.writeBuffer()
                    // console.log('write buffer', result);
                }
                else {
                    result = getUserAccess;
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-downloadDataUserRole ' + error);
            }
        });
    };
}
exports.default = makeDownloadDataUserDetailRole;
