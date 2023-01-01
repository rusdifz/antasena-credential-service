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
function makeDownloadDataUserDetailBranch({ internalServer, ExcelJs, moment }) {
    return function downloadDataUserDetailBranch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUser = yield internalServer.getMasterUser(body);
                let user = [];
                yield getUser.data.users.map(data => {
                    let updatedTime;
                    if (data.updatedTime == null) {
                        updatedTime = null;
                    }
                    else {
                        updatedTime = moment(data.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                    }
                    if (data.username == body.username) {
                        const dataUser = {
                            username: data.username,
                            email: data.email,
                            fullname: data.fullname,
                            createdTime: moment(data.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                            createdUser: data.createdUser,
                            updatedTime: updatedTime,
                            updatedUser: data.updatedUser
                        };
                        console.log('user branch', dataUser);
                        user.push(dataUser);
                    }
                });
                console.log('user branch 2', user);
                const workbook = new ExcelJs.Workbook(); //creating workbook
                const worksheet = workbook.addWorksheet('Data User Branch'); //creating worksheet
                //  WorkSheet Header
                const kolom = [
                    { header: 'Username', key: 'username', width: 25 },
                    { header: 'Email', key: 'email', width: 25 },
                    { header: 'Fullname', key: 'fullname', width: 25 },
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
                const filename = 'user-branch.xlsx';
                const writefile = yield workbook.xlsx.writeFile('src/credential/file/' + filename);
                const result = filename;
                // const result = await workbook.xlsx.writeBuffer()
                // console.log('write buffer', result);
                return result;
            }
            catch (error) {
                throw new Error('usecase-downloadDataUserBranch ' + error);
            }
        });
    };
}
exports.default = makeDownloadDataUserDetailBranch;
