// import {AttachmentType, PrismaClient} from "@prisma/client";
// import {Request, Response} from "express";
// import csv from 'csv-parser';
// import exceptions from "../../exceptions";
// import path from 'path';
// import responses from "../../responses";
// import * as fs from "fs";
// import csvParser from "csv-parser";
// import {SERVER} from "../../config";
// import {getFileExtension} from "../../utils/general";
//
//
// const prisma = new PrismaClient();
//
// const importBulkData = async (req: Request, res: Response) => {
//
//   try {
//
//     if (!req.file) {
//       return res.status(400).json({error: 'No file uploaded'});
//     }
//
//     const csvFile = req.file.path;
//     const sheetName = 'Zone'; // Change this to the sheet you want to import
//
//     const records: any[] = [];
//     let currentSheetName = '';
//
//     fs.createReadStream(csvFile).pipe(csv())
//       .on('data', (data) => {
//         records.push(data);
//       })
//       .on('end', async () => {
//         if (records.length === 0) {
//           return res.status(400).json({error: 'Sheet not found'});
//         }
//
//         console.log('records> ',records);
//
//         if(req.file.originalname == 'Zone.csv') {
//           const createPromises = records.map((record) =>
//             prisma.zone.create({
//               data: {
//                 name: record.name,
//                 code: record.code,
//                 stateId: record.stateId,
//                 adminId: record.adminId,
//                 // Add more fields as needed
//               },
//             }).catch((error) => {
//               console.error('Error creating record: ', error);
//               res.status(500).json({error: `Internal server error, ${error}`});
//
//               return error;
//             })
//           );
//
//           await Promise.all(createPromises);
//         }else if(req.file.originalname == 'Range.csv'){
//           const createPromises = records.map((record) =>
//             prisma.range.create({
//               data: {
//                 name: record.name,
//                 code: record.code,
//                 stateId: record.stateId,
//                 adminId: record.adminId,
//                 zoneId: record.zoneId,
//                 // Add more fields as needed
//               },
//             }).catch((error) => {
//               console.error('Error creating record: ', error);
//               res.status(500).json({error: `Internal server error, ${error}`});
//
//               return error;
//             })
//           );
//
//           await Promise.all(createPromises);
//         }else if(req.file.originalname == 'District.csv'){
//           const createPromises = records.map((record) =>
//             prisma.district.create({
//               data: {
//                 name: record.name,
//                 code: record.code,
//                 stateId: record.stateId,
//                 adminId: record.adminId,
//                 zoneId: record.zoneId,
//                 rangeId: record.rangeId
//                 // Add more fields as needed
//               },
//             }).catch((error) => {
//               console.error('Error creating record: ', error);
//               res.status(500).json({error: `Internal server error, ${error}`});
//
//               return error;
//             })
//           );
//
//           await Promise.all(createPromises);
//         }else if(req.file.originalname == 'SubDivision.csv'){
//           const createPromises = records.map((record) =>
//             prisma.subDivision.create({
//               data: {
//                 name: record.name,
//                 code: record.code,
//                 stateId: record.stateId,
//                 adminId: record.adminId,
//                 zoneId: record.zoneId,
//                 rangeId: record.rangeId,
//                 districtId:record.districtId
//                 // Add more fields as needed
//               },
//             }).catch((error) => {
//               console.error('Error creating record: ', error);
//               res.status(500).json({error: `Internal server error, ${error}`});
//
//               return error;
//             })
//           );
//
//           await Promise.all(createPromises);
//         }else if(req.file.originalname == 'PoliceStation.csv'){
//
//           const data = records.map(record => {
//             return {
//               name: record.name,
//               pscode: record.psCode,
//               code: record.code,
//               stateId: record.stateId,
//               adminId: record.adminId,
//               zoneId: record.zoneId,
//               rangeId: record.rangeId,
//               districtId:record.districtId,
//               subDivisionId:record.subDivisionID
//             }
//           })
//
//           await prisma.policeStation.createMany({
//             data: data,
//             skipDuplicates: true
//           });
//
//         }else if(req.file.originalname == 'TaskTypes.csv'){
//           const data = records.map(record => {
//             return {
//               name: record.name,
//               code: record.code,
//             }
//           })
//           await prisma.taskTypes.createMany({
//             data: data,
//             skipDuplicates: true
//           });
//         }else if(req.file.originalname == 'DutyTypes.csv'){
//           const data = records.map(record => {
//             return {
//               name: record.name,
//               code: record.code,
//             }
//           })
//           await prisma.dutyTypes.createMany({
//             data: data,
//             skipDuplicates: true
//           });
//         }else if(req.file.originalname == 'ReportTypes.csv'){
//           const data = records.map(record => {
//             return {
//               name: record.name,
//               code: record.code,
//             }
//           })
//           await prisma.reportTypes.createMany({
//             data: data,
//             skipDuplicates: true
//           });
//         }else if(req.file.originalname == 'TypeReport.csv'){
//           const data = records.map(record => {
//             return {
//               name: record.name,
//               code: record.code,
//             }
//           })
//           await prisma.typeReport.createMany({
//             data: data,
//             skipDuplicates: true
//           });
//         }else if(req.file.originalname == 'DateFilterTypes.csv'){
//           const data = records.map(record => {
//             return {
//               name: record.name,
//               code: record.code,
//             }
//           })
//           await prisma.dateFilterTypes.createMany({
//             data: data,
//             skipDuplicates: true
//           });
//         }else if(req.file.originalname == 'InventoryTypes.csv'){
//           const data = records.map(record => {
//             return {
//               inventoryType: record.inventoryType,
//               inventoryTypeCode: record.inventoryTypeCode,
//               description: record.description,
//             }
//           })
//           await prisma.inventoryTypeMaster.createMany({
//             data: data,
//             skipDuplicates: true
//           });
//         }
//
//         res.json({message: 'Data imported successfully'});
//       });
//
//     console.log(records);
//
//   } catch
//     (error) {
//     console.error('Error:', error);
//     res.status(500).json({error: 'Internal server error'});
//   }
//
//
// }
//
// export {importBulkData};
