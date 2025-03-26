const mongoose = require('mongoose');
const messages = require('../locales/messages');

const TermsAndConditionsSchema = new mongoose.Schema({
  content: [
    {
      title: {
        en: {
          type: String,
          required: [true, messages.contentRequired.en],
        },
        ar: {
          type: String,
          required: [true, messages.contentRequired.en],
        },
      },
      details: [
        {
          en: {
            type: String,
            required: [true, messages.contentRequired.en],
          },
          ar: {
            type: String,
            required: [true, messages.contentRequired.en],
          },
        },
      ],
      order: Number,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
TermsAndConditionsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure there's only one instance
TermsAndConditionsSchema.statics.getInstance = async function () {
  let instance = await this.findOne();
  if (!instance) {
    const instance = await this.create({
      content: [
        {
          title: {
            en: 'Introduction to Terms',
            ar: 'مقدمة في الشروط',
          },
          details: [
            {
              en: 'These terms govern the use of our services.',
              ar: 'تحكم هذه الشروط استخدام خدماتنا.',
            },
            {
              en: 'Please read these terms carefully before using our services.',
              ar: 'يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا.',
            },
          ],
          order: 1,
        },
        {
          title: {
            en: 'User Responsibilities',
            ar: 'مسؤوليات المستخدم',
          },
          details: [
            {
              en: 'Users must comply with all rules and policies.',
              ar: 'يجب على المستخدمين الامتثال لجميع القواعد والسياسات.',
            },
            {
              en: 'Users are responsible for maintaining the security of their accounts.',
              ar: 'المستخدمون مسؤولون عن الحفاظ على أمان حساباتهم.',
            },
            {
              en: 'Users must not share their login credentials with others.',
              ar: 'يجب على المستخدمين عدم مشاركة بيانات تسجيل الدخول الخاصة بهم مع الآخرين.',
            },
          ],
          order: 2,
        },
        {
          title: {
            en: 'Privacy Policy',
            ar: 'سياسة الخصوصية',
          },
          details: [
            {
              en: 'We value your privacy and protect your data.',
              ar: 'نحن نقدر خصوصيتك ونحمي بياناتك.',
            },
            {
              en: 'We only collect necessary personal information.',
              ar: 'نقوم بجمع المعلومات الشخصية الضرورية فقط.',
            },
          ],
          order: 3,
        },
      ],
      updatedAt: Date.now(),
    });
  }
  return instance;
};

module.exports = mongoose.model('TermsAndConditions', TermsAndConditionsSchema);
