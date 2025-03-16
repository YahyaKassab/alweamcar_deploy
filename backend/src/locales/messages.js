const messages = {
    required: { en: 'This field is required.', ar: 'هذا الحقل مطلوب.' },
    imageOnly: { en: 'Only image files are allowed.', ar: 'مسموح بالصور فقط' },
    contentRequired: { en: 'Content is required.', ar: 'المحتوى مطلوب.' },
    unauthorized: {
        en: 'Unauthorized access. You do not have permission to perform this action.',
        ar: 'الوصول غير مصرح به. ليس لديك إذن لتنفيذ هذا الإجراء.',
    },
    admin_not_found: {
        en: 'Admin not found with id {id}.',
        ar: 'لم يتم العثور على المسؤول بالمعرف {id}.',
    },
    make_model_required:{en:'Either provide both make name and model' , ar:'برجاء اضافة نوع وموديل السيارة'},
    reset_password_subject: {
        en: 'Password Reset Request',
        ar: 'طلب إعادة تعيين كلمة المرور',
    },
    email_sent: {
        en: 'Reset email sent successfully.',
        ar: 'تم إرسال بريد إعادة التعيين بنجاح.',
    },
    email_failed: {
        en: 'Email could not be sent.',
        ar: 'لم يتم إرسال البريد الإلكتروني.',
    },
    invalid_reset_token: {
        en: 'Invalid or expired reset token.',
        ar: 'رمز إعادة التعيين غير صالح أو منتهي الصلاحية.',
    },
    provide_email_password: {
        en: 'Please provide an email and password',
        ar: 'يرجى تقديم البريد الإلكتروني وكلمة المرور',
    },
    invalid_credentials: { en: 'Invalid credentials', ar: 'بيانات الاعتماد غير صالحة' },
    notFound: { en: 'Resource not found.', ar: 'المورد غير موجود.' },
    no_auth_token: { en: 'No authorization token provided.', ar: 'لم يتم توفير رمز المصادقة.' },
    invalid_token: {
        en: 'Invalid token. Please log in again.',
        ar: 'رمز غير صالح. الرجاء تسجيل الدخول مرة أخرى.',
    },
    serverError: { en: 'Internal server error.', ar: 'خطأ داخلي في الخادم.' },
    invalidInput: { en: 'Invalid input provided.', ar: 'إدخال غير صالح.' },
    newsNotFound: {
        en: 'News not found with id of {id}',
        ar: 'لم يتم العثور على الخبر بالمعرف {id}',
    },
    newsDeleted: { en: 'News item deleted successfully', ar: 'تم حذف الخبر بنجاح' },
    offerNotFound: {
        en: 'Seasonal offer not found with id of {id}',
        ar: 'لم يتم العثور على العرض الموسمي بالمعرف {id}',
    },
    invalid_id: {
        en: 'Invalid ID format: {id}.',
        ar: 'تنسيق معرف غير صالح: {id}.',
    },
    duplicate_key: {
        en: 'The {field} is already in use.',
        ar: 'الحقل {field} مستخدم بالفعل.',
    },
    offerDeleted: { en: 'Seasonal offer deleted successfully', ar: 'تم حذف العرض الموسمي بنجاح' },
    accessDenied: { en: 'Access denied.', ar: 'تم رفض الوصول.' },
    nameRequired: { en: 'Please provide name', ar: 'يرجى تقديم الاسم' },
    mobileRequired: { en: 'Please provide mobile number', ar: 'يرجى تقديم رقم الهاتف' },
    emailRequired: { en: 'Please provide email', ar: 'يرجى تقديم البريد الإلكتروني' },
    invalidEmail: { en: 'Please provide a valid email', ar: 'يرجى تقديم بريد إلكتروني صحيح' },
    passwordRequired: { en: 'Please provide a password', ar: 'يرجى تقديم كلمة المرور' },
    messageRequired: { en: 'Please provide your message', ar: 'يرجى تقديم رسالتك' },
    imageRequired: { en: 'Please upload an image', ar: 'يرجى تحميل صورة' },
    deleted: { en: 'item deleted successfully.', ar: 'تم الحذف بنجاح.' },
    makeRequired: { en: 'Please provide the car make', ar: 'يرجى تقديم ماركة السيارة' },
    modelRequired: { en: 'Please provide the car model', ar: 'يرجى تقديم موديل السيارة' },
    yearRequired: { en: 'Please provide the car year', ar: 'يرجى تقديم سنة صنع السيارة' },
    conditionRequired: { en: 'Please specify the car condition', ar: 'يرجى تحديد حالة السيارة' },
    mileageRequired: { en: 'Please provide the car mileage', ar: 'يرجى تقديم عدد الأميال للسيارة' },
    stockNumberRequired: { en: 'Please provide the stock number', ar: 'يرجى تقديم رقم المخزون' },
    priceRequired: { en: 'Please provide the car price', ar: 'يرجى تقديم سعر السيارة' },
    imagesRequired: {
        en: 'Please provide at least one image',
        ar: 'يرجى تقديم صورة واحدة على الأقل',
    },
    titleRequired: {
        en: 'Please provide a news title',
        ar: 'يرجى تقديم عنوان الخبر',
    },
    detailsRequired: {
        en: 'Please provide news details',
        ar: 'يرجى تقديم تفاصيل الخبر',
    },
};

module.exports = messages;
