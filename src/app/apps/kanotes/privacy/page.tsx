import type { Metadata } from 'next'

import { SectionLabel } from '@/components/SectionLabel'

export const metadata: Metadata = {
  title: 'Kanotes privacy policy',
  description: 'What Kanotes reads, where it goes, and what is kept.'
}

// The same text as screennote/docs/store/privacy-policy.md, which Google Play links to here.
/** [intro] comes before the list, [text] after it. */
type Part = {
  heading: string
  intro?: string
  list?: string[]
  text?: string[]
}

const english: Part[] = [
  {
    heading: 'What Kanotes reads, and when',
    intro: 'Kanotes only reads something when you ask it to:',
    list: [
      'Side button: when Kanotes is your digital assistant and you hold the side button, Android gives Kanotes the text and a screenshot of the screen you’re on.',
      'Quick Settings tile: Android asks your permission, then gives Kanotes a screenshot.',
      'Share: text or an image you share to Kanotes from another app.',
      'Widget: the text you last copied, when you tap the widget.',
      'The + button: what you type.'
    ],
    text: ['Text in screenshots and images is recognised on your phone.']
  },
  {
    heading: 'Where it is read',
    list: [
      'On your phone (the default). Gemini Nano, or the Gemma model on phones without Nano, reads the text on your phone. It does not leave your phone.',
      'Kanotes Cloud (optional subscription). If you subscribe, the text is sent to Google’s Gemini service (through Google Firebase) to be read, and the answer comes back to your phone. Kanotes doesn’t keep a copy anywhere else. Google handles this text under its own terms and privacy policy. To check that requests really come from Kanotes, Firebase App Check sends Google information about the app and your device’s integrity (Google Play Integrity).'
    ]
  },
  {
    heading: 'What is kept, and where',
    list: [
      'Saved events go to a calendar called “Kanotes” on your phone. Kanotes only changes or deletes events in that calendar.',
      'Saved notes and settings are stored in Kanotes on your phone.',
      'Nothing you save is uploaded or backed up by Kanotes, and nothing is moved to a new phone.',
      'Kanotes deletes or archives old items after the number of days you choose. Uninstalling Kanotes deletes its notes and settings. Events in the “Kanotes” calendar can be deleted in Kanotes or your calendar app.',
      'If you subscribe to Kanotes Cloud, Kanotes counts how many cloud reads you’ve used this month. The count stays on your phone.'
    ]
  },
  {
    heading: 'Other services Kanotes uses',
    list: [
      'Google Play Billing handles the Kanotes Cloud subscription. Kanotes only learns whether you’re subscribed; payment details stay with Google.',
      'Hugging Face hosts the Gemma model. Downloading it, once, sends your IP address and basic request details to Hugging Face, like any download.',
      'Google ML Kit runs text recognition and Gemini Nano on your phone. These Google libraries may send Google technical information, such as the device model and error reports; they don’t send what’s on your screen.',
      'Google Maps opens only when you tap a place, and then receives that place’s name.'
    ]
  },
  {
    heading: 'What Kanotes doesn’t do',
    text: [
      'No account. No ads. No analytics or tracking. Kanotes doesn’t sell or share your information.'
    ]
  },
  {
    heading: 'Permissions',
    list: [
      'Calendar: to add events to, and remove them from, its own “Kanotes” calendar.',
      'Screen capture and digital assistant: only to read the screen when you ask, as described above.',
      'Internet: to download the Gemma model once, and for Kanotes Cloud.',
      'Foreground services: to keep a screenshot read or the Gemma download running while it happens. Android may show this as a notification.'
    ]
  },
  {
    heading: 'Children',
    text: ['Kanotes is not directed at children under 13.']
  },
  {
    heading: 'Changes',
    text: [
      'If this policy changes, the new version will be published here with a new date.'
    ]
  }
]

const vietnamese: Part[] = [
  {
    heading: 'Kanotes đọc gì, và khi nào',
    intro: 'Kanotes chỉ đọc khi bạn yêu cầu:',
    list: [
      'Phím bên: khi Kanotes là trợ lý kỹ thuật số và bạn giữ phím bên, Android đưa cho Kanotes chữ và ảnh chụp của màn hình đang mở.',
      'Ô Cài đặt nhanh: Android hỏi bạn trước, rồi đưa cho Kanotes một ảnh chụp màn hình.',
      'Chia sẻ: chữ hoặc ảnh bạn chia sẻ vào Kanotes từ ứng dụng khác.',
      'Tiện ích: chữ bạn vừa sao chép, khi bạn chạm vào tiện ích.',
      'Nút +: những gì bạn gõ.'
    ],
    text: [
      'Chữ trong ảnh chụp và hình ảnh được nhận dạng ngay trên điện thoại.'
    ]
  },
  {
    heading: 'Đọc ở đâu',
    list: [
      'Trên điện thoại (mặc định). Gemini Nano, hoặc mô hình Gemma trên điện thoại không có Nano, đọc chữ ngay trên điện thoại. Chữ không rời khỏi điện thoại.',
      'Kanotes Cloud (gói đăng ký, không bắt buộc). Nếu bạn đăng ký, chữ được gửi đến dịch vụ Gemini của Google (qua Google Firebase) để đọc, rồi kết quả trả về điện thoại. Kanotes không giữ bản sao ở nơi nào khác. Google xử lý chữ này theo điều khoản và chính sách quyền riêng tư của Google. Để chắc rằng yêu cầu thật sự đến từ Kanotes, Firebase App Check gửi cho Google thông tin về ứng dụng và độ toàn vẹn của thiết bị (Google Play Integrity).'
    ]
  },
  {
    heading: 'Giữ lại những gì, và ở đâu',
    list: [
      'Sự kiện đã lưu nằm trong lịch “Kanotes” trên điện thoại. Kanotes chỉ sửa hoặc xóa sự kiện trong lịch đó.',
      'Ghi chú đã lưu và cài đặt nằm trong Kanotes trên điện thoại.',
      'Kanotes không tải lên, không sao lưu những gì bạn lưu, và không chuyển chúng sang điện thoại mới.',
      'Kanotes tự xóa hoặc lưu trữ mục cũ sau số ngày bạn chọn. Gỡ Kanotes sẽ xóa ghi chú và cài đặt của ứng dụng. Sự kiện trong lịch “Kanotes” có thể xóa trong Kanotes hoặc ứng dụng lịch.',
      'Nếu bạn đăng ký Kanotes Cloud, Kanotes đếm số lượt đọc trên đám mây đã dùng trong tháng. Con số này chỉ nằm trên điện thoại.'
    ]
  },
  {
    heading: 'Các dịch vụ khác Kanotes dùng',
    list: [
      'Google Play Billing xử lý gói Kanotes Cloud. Kanotes chỉ biết bạn đã đăng ký hay chưa; thông tin thanh toán do Google giữ.',
      'Hugging Face lưu trữ mô hình Gemma. Tải mô hình về (một lần) sẽ gửi địa chỉ IP và thông tin yêu cầu cơ bản đến Hugging Face, như mọi lần tải về.',
      'Google ML Kit chạy nhận dạng chữ và Gemini Nano trên điện thoại. Các thư viện này của Google có thể gửi cho Google thông tin kỹ thuật như loại máy và báo lỗi; chúng không gửi nội dung màn hình của bạn.',
      'Google Maps chỉ mở khi bạn chạm vào một địa điểm, và nhận tên địa điểm đó.'
    ]
  },
  {
    heading: 'Kanotes không làm gì',
    text: [
      'Không tài khoản. Không quảng cáo. Không phân tích hay theo dõi. Kanotes không bán hay chia sẻ thông tin của bạn.'
    ]
  },
  {
    heading: 'Quyền truy cập',
    list: [
      'Lịch: để thêm và xóa sự kiện trong lịch “Kanotes” riêng của ứng dụng.',
      'Chụp màn hình và trợ lý kỹ thuật số: chỉ để đọc màn hình khi bạn yêu cầu, như trên.',
      'Internet: để tải mô hình Gemma một lần, và cho Kanotes Cloud.',
      'Dịch vụ chạy nền: để việc đọc ảnh chụp màn hình hoặc tải mô hình Gemma tiếp tục khi đang diễn ra. Android có thể hiện việc này thành một thông báo.'
    ]
  },
  { heading: 'Trẻ em', text: ['Kanotes không dành cho trẻ em dưới 13 tuổi.'] },
  {
    heading: 'Thay đổi',
    text: [
      'Nếu chính sách thay đổi, bản mới sẽ được đăng tại đây với ngày mới.'
    ]
  }
]

const CONTACT = 'lephuochoang1810@gmail.com'

export default function KanotesPrivacyPage() {
  return (
    <div className="space-y-8">
      <section className="card p-6">
        <h1 className="font-display text-3xl font-bold">
          Kanotes privacy policy
        </h1>
        <p className="mt-2 font-label text-[10px] text-muted">
          Effective 16 November 2026 · Tiếng Việt bên dưới
        </p>
        <p className="mt-3 text-sm">
          Kanotes is made by Le Phuoc Hoang. This policy explains what Kanotes
          reads, where it goes, and what is kept.
        </p>
      </section>
      <Policy
        lang="en"
        label="english"
        parts={english}
        contactHeading="Contact"
      />
      <Policy
        lang="vi"
        label="tiếng việt"
        parts={vietnamese}
        contactHeading="Liên hệ"
      />
    </div>
  )
}

function Policy({
  lang,
  label,
  parts,
  contactHeading
}: {
  lang: string
  label: string
  parts: Part[]
  contactHeading: string
}) {
  return (
    <section lang={lang}>
      <SectionLabel>{label}</SectionLabel>
      <div className="card space-y-5 p-5 text-sm leading-relaxed">
        {parts.map(part => (
          <div key={part.heading}>
            <h2 className="font-display text-base font-bold">{part.heading}</h2>
            {part.intro && <p className="mt-1">{part.intro}</p>}
            {part.list && (
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {part.list.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {part.text?.map(line => (
              <p key={line} className="mt-1">
                {line}
              </p>
            ))}
          </div>
        ))}
        <div>
          <h2 className="font-display text-base font-bold">{contactHeading}</h2>
          <a
            href={`mailto:${CONTACT}`}
            className="mt-1 inline-block text-accent"
          >
            {CONTACT}
          </a>
        </div>
      </div>
    </section>
  )
}
