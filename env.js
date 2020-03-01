const messageEvent = {
  contact: 'ติดต่อพนักงาน',
  guide: 'แนะนำการใช้งาน',
  holiday: 'วันหยุด',
  location: 'ที่อยู่',
  price: 'ราคา',
  register: {
    prompt: 'ต่ออายุการใช้งาน',
    random: '/rc',
    get: '/c'
  },
  reply: '=> ',
  web: {
    prompt: '/web'
  }
}

const messageGroup = {
  banFriend: 'b',
  friend: 'f',
  newFriend: 'n',
  vipFriend: 'v',
  warningFriend: 'w'
}

const messageText = {
  banFriend:
    'ขออภัย บอทอยู่ในช่วงกำลังพัฒนา ติดต่อเพิ่มเติมที่เมนูด้านล่างขวามือ',
  contact: 'โทร: 0922649088 \nไลน์: https://line.me/ti/p/KY6UiRe60S',
  exipred: [
    'ลูกค้าหมดอายุการใช้งาน หากต้องการใช้งานต่อกรุณากรอกรหัสเพื่อต่ออายุสมาชิก',
    'ตัวอย่างการต่ออายุสมาชิค\n https://youtu.be/AlVUQmd4QeA'
  ],
  echoPrompt: [
    // 'ขออภัย บอทอยู่ในช่วงกำลังพัฒนา ติดต่อเพิ่มเติมที่เมนูด้านล่างขวามือ',
    'กรุณารอซักครู่ ...',
    'ตอนนี้ระบบจะแสดงผลเฉพาะข้อความและรูปภาพเท่านั้น'
  ],
  registerPrompt: [
    'ผู้ใช้เป็นสมาชิกวีไอพี',
    'ไม่จำเป็นต้องต่ออายุสมาชิก',
    'ผู้ใช้สามารถสอบถามราคาได้',
    'ถึงวันที่',
    'ต่ออายุสมาชิก',
    'bot send register prompt',
    'ยืนยันรหัสสำเร็จ',
    'รหัสสมาชิกถูกสุ่มแล้ว',
    'รหัสสมาชิกใหม่: ',
    'รหัสสมาชิก: '
  ],
  webPrompt: ['เพื่อน', 'ประวัตการสนทนา', 'ตั้งค่า']
}

module.exports = {
  messageEvent,
  messageGroup,
  messageText
}
