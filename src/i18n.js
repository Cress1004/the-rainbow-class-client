import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next",
    },
  },
  vi: {
    translation: {
      welcome_message: "Chào mừng đến với Lớp học Cầu Vồng!",
      login: "Đăng nhập",
      email: "Địa chỉ email",
      password: "Mật khẩu",
      input_email: "Nhập địa chỉ email",
      input_password: "********",
      forgot_password: "Quên mật khẩu?",
      reset_password: "Đặt lại mật khẩu",
      reset_password_message:
        "Email cấp lại mật khẩu sẽ được gửi đến địa chỉ dưới đây:",
      reset_email: "Nhập vào địa chỉ email",
      password_confirm: "Nhập lại mật khẩu",
      input_password_confirm: "********",
      back_to_login: "Quay lại trang đăng nhập",
      logout: "Đăng xuất",
      profile: "Thông tin cá nhân",
      ok: "OK",
      class: "Lớp",
      class_list: "Danh sách các lớp học",
      class_name: "Tên lớp",
      address: "Địa chỉ",
      class_monitor: "Lớp trưởng",
      target_student: "Đối tượng",
      number_of_student: "Sĩ số",
      my_schedule: "Lịch cá nhân",
      cancel: "Quay lại",
      volunteer_list: "Danh sách Tình nguyện viên",
      volunteer: "Tình nguyện viên",
      user_name: "Họ và tên",
      phone_number: "Số điện thoại",
      input_name: "Nhập họ và tên",
      add_volunteer: "Thêm mới tình nguyện viên",
      input_phone_number: "Nhập vào số điện thoại",
      input_province: "Tỉnh/Thành phố",
      input_district: "Quận/Huyện",
      input_ward: "Phường/Xã",
      input_specific_address: "Nhập vào chi tiết địa chỉ/Số nhà",
      input_class: "Lớp học trực thuộc",
      role: "Chức vụ",
      sub_class_monitor: "Lớp phó",
      add_class: "Thêm mới lớp học",
      unset: "Chưa được xếp",
      description: "Mô tả",
      student_type: "Đối tượng học sinh",
      register: "Đăng kí",
      input_class_name: "Nhập vào tên lớp học",
      input_description: "Nhập vào mô tả",
      input_student_type: "Nhập vào đối tượng học sinh",
      class_detail: "Chi tiết lớp học",
      schedule_time: "Lịch học",
      number_of_students: "Số lượng học sinh",
      number_of_volunteers: "Số lượng tình nguyện viên",
      master_setting: "Cài đặt chung",
      student_types: "Đối tượng",
      action: "Hành động",
      back: "Quay lại",
      add_new_student_type: "Thêm mới đối tượng học sinh",
      dashboard: "Trang chủ",
      schedule_manager: "Quản lý lịch lớp",
      user_manager: "Quản lý người dùng",
      admin: "Quản trị viên",
      student: "Học sinh",
      class_manager: "Quản lý lớp học",
      edit_class: "Chỉnh sửa thông tin lớp học",
      delete_class: "Xóa lớp học",
      update: "Lưu thay đổi",
      short_class_monitor: "LT",
      short_sub_class_monitor: "LP",
      edit_volunteer: "Chỉnh sửa thông tin TNV",
      delete_volunteer: "Xóa TNV",
      volunteer_detail: "Thông tin chi tiết Tình nguyện viên",
      gender: "Giới tính",
      male: "Nam",
      female: "Nữ",
      edit_student: "Sửa thông tin học sinh",
      parent_name: "Họ và tên phụ huynh",
      student_detail: "Thông tin chi tiết học sinh",
      delete_student: "Xóa học sinh",
      student_list: "Danh sách học sinh",
      add_student: "Thêm mới học sinh",
      lesson_name: "Tên bài học",
      person_in_charge: "Người phụ trách",
      time: "Thời gian",
      teach_option: "Hình thức học",
      lesson_list: "Danh sách bài học",
      un_register: "Chưa đăng kí",
      add_lesson: "Thêm bài học",
      online_option: "Online",
      offline_option: "Offline",
      lesson_detail: "Chi tiết bài học",
      paticipants: "Danh sách tình nguyện viên tham gia",
      edit_lesson: "Sửa bài học",
      delete_lesson: "Xóa bài học",
      link_online: "Link",
      schedule: "Lịch học",
      default_schedule: "Lịch học cố định",
      lesson: "Bài học",
      not_have_default_schedule: "Chưa có lịch học cố định",
      assign_student_to_class: "Xếp sinh viên vào lớp",
      change_avatar: "Sửa avatar",
      save_avatar: "Cập nhật avatar",
      edit_profile: "Sửa thông tin cá nhân",
      change_password: "Đổi mật khẩu",
      old_password: "Mật khẩu hiện tại",
      new_password: "Mật khẩu mới",
      confirm_new_password: "Nhập lại mật khẩu mới",
      confirm_password_is_not_match:
        "Mật khẩu xác nhận không khớp với mật khẩu mới",
      unregister_person: "Chưa đăng kí",
      unassign_this_schedule: "Hủy đăng kí",
      assign_this_schedule: "Đăng kí",
      class_schedule: "Lịch hoạt động",
      select_class: "Chọn lớp",
      detail: "Chi tiết >>>",
      interest: "Sở thích",
      character: "Tính cách",
      overview: "Tổng quan",
      undescription: "Chưa có mô tả",
      comment_student: "Nhập nhận xét",
      student_name: "Tên học sinh",
      my_class: "Lớp của tôi",
      all_option: "Tất cả",
      search_by_name_phone_email: "Tìm kiếm theo tên/email/số điện thoại",
      search_by_name_phone: "Tìm kiếm theo tên/số điện thoại",
      search_by_class_name: "Tìm kiếm theo tên lớp",
      uploads_your_cv: "Tải CV lên (Định dạng PDF)",
      register_class: "Lớp học đăng kí",
      input_select_class: "Chọn lớp học",
      thanks_for_applying: "Cảm ơn bạn đã gửi CV!",
      remind_user_check_mail:
        "Hãy thường xuyên check mail để nhận lịch phỏng vấn.",
      cv_manager: "Quản lý CV",
      status: "Trạng thái",
      list_cv: "Danh sách CV",
      cv_detail: "Chi tiết CV",
      create_time: "Thời gian đăng kí",
      cv_file: "CV File",
      download_here: "Tải CV tại đây",
      show_cv: "Xem CV",
      close_cv: "Đóng CV",
      free_time_table: "Lịch rảnh",
      no_comment: "Không có",
      note: "Ghi chú",
      interview_time: "Thời gian phỏng vấn",
      set_interview_time: "Đặt lịch phỏng vấn",
      input_interview_time: "Điền vào thời gian phỏng vấn",
      applier_free_time: "Thời gian rảnh của ứng viên",
      date_placeholder: "2020-02-20",
      time_placeholder: "00:00",
      from: "Từ",
      to: "Đến",
      delete: "Xóa",
      set_monitor: "Quản lý cán sự",
      input_weekday: "Chọn thứ trong tuần",
      interviewer_name: "Tên ứng viên",
      select_person_in_charge: "Chọn người phụ trách",
      input_lesson_name: "Nhập vào tên bài học",
      input_link: "https://example.com",
      basic_infor: "Thông tin cơ bản",
      pair_manager: "Thông tin dạy kèm",
      pair_manager_list: "Danh sách dạy kèm",
      teaching_option: "Hình thức dạy",
      lessons: "Bài học",
      deactive_volunteer: "TNV chưa kích hoạt tài khoản",
      pairs_table: "Danh sách dạy kèm",
      number_of_lessons: "Số tiết học",
      volunteer_incharge: "TNV phụ trách",
      show_more: "xem thêm",
      close: "đóng",
      link_facebook: "Link Facebook",
      input_link_facebook: "Nhập vào link Facebook",
      required_birthday: "Hãy nhập vào ngày sinh",
      input_parent_name: "Nhập vào tên bố/hoặc mẹ của học sinh",
      birthday: "Ngày sinh",
      required_admission_day: "Hãy điền vào ngày nhập học",
      admission_day: "Ngày nhập học",
      retirement_date: "Ngày thôi học",
      updated_by: "Cập nhật bởi",
      retired_date: "Ngày thôi học",
      subject: "Môn học",
      add_new_subject: "Thêm mới môn học",
      grade: "Khối lớp",
      add_new_grade: "Thêm khối lớp",
      semester: "Kì học",
      semester_name: "Tên kì học",
      start_date: "Ngày bắt đầu",
      end_date: "Ngày kết thúc",
      add_new_semester: "Thêm kì học mới",
      number_of_lessons_per_week: "Số buổi",
      lessons_per_week: "buổi/tuần",
      note: "Ghi chú",
      number_of_unregister_student: "Số học sinh chưa được đăng kí",
      number_of_waiting_student: "Số học sinh đang đợi xếp TNV",
      number_of_unregister: "Chưa được đăng kí",
      number_of_waiting: "Đang đợi xếp TNV",
      register_pair_for_student: "Đăng kí xếp TNV cho học sinh",
      report: "Báo cáo",
      add_report: "Viết báo cáo",
      new_report: "Thêm báo cáo",
      input_point: "Đánh giá điểm",
      select_month: "Chọn tháng",
      created_time: "Thời gian tạo",
      point: "Điểm",
      comment: "Nhận xét",
      report_detail: "Chi tiết báo cáo",
      created_by: "Người tạo",
      lesson_description: "Mô tả bài học",
      title: "Tiêu đề",
      average: "Trung bình",
      my_report: "Báo cáo cá nhân",
      class_report_list: "Thành tích lớp học",
      volunteers_list: "Danh_sach_TNV",
      export_volunteers_data_to_excel: "Xuất danh sách TNV",
      export_students_data_to_excel: "Xuất danh sách học sinh",
      monthly_report: "Thành tích tháng",
      semester_report: "Thành tích kỳ học",
      cv_question: "Câu hỏi phỏng vấn",
      add_question: "Thêm câu hỏi",
      add_new_question: "Thêm câu hỏi",
      question_content: "Nội dung câu hỏi",
      is_required: "Bắt buộc",
      question_number: "Câu hỏi",
      note_required: "(Bắt buộc)",
      note_not_required: "(Không bắt buộc)",
      achievement: "Thành tích",
      select_semester: "Kỳ học",
      show_cv_answers: "Xem các câu trả lời",
      audio_intro_by_english: "Video/Audio giới thiệu",
      delete_question: "Xóa câu hỏi",
      //noti
      assign_success: "Đăng kí thành công",
      unassign_success: "Hủy đăng kí thành công",
      //modal:
      modal_change_password_title: "Đổi mật khẩu",
      modal_confirm_delete_class_title: "Xác nhận xóa lớp học",
      modal_confirm_delete_class_content: "Xác nhận bạn muốn xóa lớp học này?",
      modal_confirm_delete_volunteer_title: "Xác nhận xóa tình nguyện viên",
      modal_confirm_delete_volunteer_content:
        "Xác nhận bạn muốn xóa tình nguyện viên này",
      modal_confirm_delete_student_title: "Xác nhận xóa học sinh",
      modal_confirm_delete_student_content:
        "Xác nhận bạn muốn xóa tình nguyện viên này",
      modal_confirm_delete_lesson_title: "Xác nhận xóa bài học",
      modal_confirm_delete_lesson_content: "Xác nhận xóa bài học này",
      modal_input_retired_date: "Nhập vào ngày thôi học",
      modal_confirm_delete_question: "Xác nhận xóa câu hỏi phỏng vấn",
      modal_confirm_delete_question_content: "Bạn có chắc chắn xóa câu hỏi này?",
      //validation:
      required_name_message: "Hãy nhập vào tên của bạn",
      required_phone_number_message:
        "Hãy nhập vào số điện thoại liên lạc của bạn",
      invalid_phone_number: "Số điện thoại chưa đúng định dạng",
      invalid_email_message: "Địa chỉ email chưa đúng định dạng",
      required_email_message: "Hãy nhập vào địa chỉ email",
      required_password_message: "Hãy nhập vào mật khẩu",
      required_file_message: "Hãy tải lên file",
      required_lesson_name_message: "Hãy nhập vào tên bài học",
      required_lesson_description_message:
        "Hãy nhập vào mô tả nội dung bài học",
      link_is_invalid: "Hãy nhập vào đúng định dạng của đường link",
      required_class_name_message: "Hãy nhập vào tên lớp học",
      required_class_description_message: "Hãy nhập vào mô tả cho lớp học",
      only_pdf_accept: "Hãy tải lên file với định dạng pdf.",
      file_size_must_be_less_than: "File phải có kích thước nhỏ hơn",
      required_min_length_of_password_message:
        "Độ dài của mật khẩu cần lớn hơn 8 kí tự",
      required_confirm_password_message: "Hãy nhập lại mật khẩu để xác nhận",
      required_confirm_password_must_match_message:
        "Hãy nhập lại chính xác mật khẩu mới",
      login_fail_message: "Log Out Failed",
      error_email_or_password_message:
        "Email hoặc mật khẩu bạn nhập vào là không đúng, hãy kiểm tra lại",
      fail_to_login: "Check out your Account or Password again",
      reset_email_was_sent:
        "Email cấp lại mật khẩu đã được gửi. Hãy kiểm tra hòm thư!",
      some_thing_went_wrong: "Lỗi hệ thống!",
    },
  },
};
i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
