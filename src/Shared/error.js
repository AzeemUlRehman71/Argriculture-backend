const errorList = []
errorList[1] =  'Internal Server Error.';
errorList[2] =  'Bad Request';
errorList[3] =  'Sorry, Failed to fin user with this information.';
errorList[4] =  'Failed Validation';
errorList[6] =  'Invalid Credentials.';
errorList[7] =  'Invalid/Missing Token.';
errorList[8] =  'Sorry. you don\'t have permission to this resource.';
errorList[9] =  'Children list is empty.';


module.exports = {
  messageByCode(code){
    return errorList[code] && errorList[code].length != ''  ? errorList[code] : '';
  }
};
