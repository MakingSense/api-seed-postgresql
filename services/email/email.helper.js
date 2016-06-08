'use strict';

// TEMPLATES
import sampleTemplate from '../../config/emailTemplates/sample.json';

class EmailHelper{
    getSampleData(entity) {
      var data = {};
      // TODO: prepare data and assign to the template.

    return data;
  }

  getTemplateSample(data){
    var template = sampleTemplate;

    // todo: se the message data necessary to send the email.
    template.message.to[0].email                   = '';
    template.message.merge_vars[0].rcpt            = '';
    template.message.merge_vars[0].vars[0].content = '';
    template.message.merge_vars[0].vars[1].content = '';
    template.message.merge_vars[0].vars[2].content = '';
    template.message.merge_vars[0].vars[3].content = '';

    return template;
  }
}

var emailHelperSingleton = new EmailHelper();

export default emailHelperSingleton;
