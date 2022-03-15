const successList = []
successList[0] = 'Operation successfully executed!';
successList[1] = 'Logged in successfully.';
successList[2] = 'Congratulation! Registration process is successfull. Shortly you will recieve an email for verification. Please verify to continue.';
successList[3] = 'Users List.';
successList[4] = 'Congratulation! Email verification process is complete. Now you can Login to MyBTLLC APP.';
successList[5] = 'Child added successfully.';
successList[6] = 'Child updated successfully.';
successList[7] = 'Child List.';
successList[8] = 'Session added successfully.';
successList[9] = 'Session updated successfully.';
successList[10] = 'Session List.';
successList[11] = 'User successfully deleted';

module.exports = {
  messageByCode(code) {
    return successList[code] && successList[code].length != '' ? successList[code] : '';
  }
};