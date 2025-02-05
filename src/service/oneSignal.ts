// import { PrismaClient } from '@prisma/client';
// import { Client } from 'onesignal-node';

// const prisma = new PrismaClient();


//  async function sendNotificationToAllUsers(senderId: string, message: string, imageUrl?: string,id?:string,type?:string,title?:string,taTitle?:string) {
//   try {

//     const users = await prisma.user.findMany({
//         where:{
//             defaultVerificationType:"Mobile_OTP"
//         }
//     });
//     const currentDate = new Date(); 
//     const expiryAt = new Date(currentDate); 
//     expiryAt.setDate(expiryAt.getDate() + 1);

//     const userOSUIds = users.map(user => user.osuid);

//     const userIds = users.map(user => user.id)
    
//     const validUserIds = userOSUIds.filter(id => id ) ;

//     const newMessage = await prisma.notificationMessage.create({
//       data: {
//         senderId,
//         message,
//         imageUrl,
//         type,
//         sourceTitle:title,
//         sourceTaTitle:taTitle,
//         sourceId:id
//       },
//     });

//     const userNotificationRels = userIds.map(userId => ({
//       userId,
//       messageId: newMessage.id,
//       expiryAt : expiryAt
//     }));

//     await prisma.userNotificationRel.createMany({
//       data: userNotificationRels,
      
//     });

//     const notification = {
//         contents: { en: message },
//         include_external_user_ids: validUserIds,
//         big_picture: imageUrl,
//         data: {
//             id: id,
//             type:type
//         }
//     };
    
//     // Send the notification using OneSignal client
//     const response = await oneSignalClient.createNotification(notification);
    
//     console.log('Notification sent to all users:', response.body);

//   } catch (error) {
//     console.error('Error sending notification:', error);
//     throw error;
//   }
// }

// export default sendNotificationToAllUsers;