const messageEvent = {
  contact: 'ติดต่อพนักงาน',
  guide: 'แนะนำการใช้งาน',
  holiday: 'วันหยุด',
  location: 'ที่อยู่',
  price: 'ราคา',
  register: {
    prompt: 'ต่ออายุการใช้งาน',
    random: '/rc',
    get: '/c',
  },
  web: {
    prompt: '/web',
  },
}

const messageGroup = {
  banFriend: 'b',
  friend: 'f',
  newFriend: 'n',
  vipFriend: 'v',
  warningFriend: 'w',
}

const messageText = {
  banFriend:
    'ขออภัย บอทอยู่ในช่วงกำลังพัฒนา ติดต่อเพิ่มเติมที่เมนูด้านล่างขวามือ',
  botSendMessage: 'ระบบอัตโนมัติ ส่งข้อความ',
  contact: 'โทร: 0922649088 \nไลน์: https://line.me/ti/p/KY6UiRe60S',
  exipred:
    'ลูกค้าหมดอายุการใช้งาน หากต้องการใช้งานต่อกรุณากรอกรหัสเพื่อต่ออายุสมาชิก',
  friend: 'เพื่อน',
  history: 'ประวัติการสนทนา',
  increaseExpireDate: 'ต่ออายุสมาชิก',
  messageTypeIsNoSupport:
    'ระบบอยู่ในรอบการพัฒนา ชนิดข้อมูลที่ส่งยังไม่ได้รับการติดตั้งให้ใช้งานได้, กรุณาส่งข้อมูลใหม่',
  randomRegisterCodeSuccess: ['รหัสสมาชิกถูกสุ่มแล้ว', 'รหัสสมาชิกใหม่'],
  registerCode: 'รหัสสมาชิก',
  registerDemoLink: 'ตัวอย่างการต่ออายุสมาชิค\n https://youtu.be/AlVUQmd4QeA',
  registerSuccess: 'ยืนยันรหัสสำเร็จ',
  replyComplete: 'ส่งข้อมูลเรียบร้อยแล้ว',
  replyPrompt: 'ระบุข้อความหรือรูปภาพที่ต้องการส่ง',
  setting: 'ตั้งค่า',
  undefined: '!@#$%^&*(',
  userIsExpiredAt: ['ผู้ใช้สามารถสอบถามราคาได้', 'ถึงวันที่'],
  userIsVIP: ['ผู้ใช้เป็นสมาชิกวีไอพี', 'ไม่จำเป็นต้องต่ออายุสมาชิก'],
  usernameIsMismatched: 'ผู้ใช้ที่ระบุไม่มีอยู่ในระบบ',
}

module.exports = {
  messageEvent,
  messageGroup,
  messageText,
}
