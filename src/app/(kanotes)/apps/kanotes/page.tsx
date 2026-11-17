import Image from 'next/image'
import Link from 'next/link'

import { Icon } from '@/components/kanotes/Icon'
import { PhoneFrame } from '@/components/kanotes/PhoneFrame'
import { StoreBadge } from '@/components/kanotes/StoreBadge'
import { T } from '@/components/kanotes/T'

// Screenshots taken on a Galaxy S24 Ultra, cropped to 1080×2160; the
// Vietnamese set is the same screens with the app in Vietnamese.
const shot = (n: number, en: string, vi: string) => ({
  en: { src: `/apps/kanotes/screen-${n}.png`, alt: en },
  vi: { src: `/apps/kanotes/vi/screen-${n}.png`, alt: vi }
})

const card = shot(
  1,
  "Kapy's card over a group chat, with the event it found",
  'Thẻ của Kapy trên một nhóm chat, với sự kiện Kapy tìm thấy'
)
const reading = shot(2, 'Kapy reading the screen', 'Kapy đang đọc màn hình')
const home = shot(
  3,
  'Kanotes home with events and a note',
  'Màn hình chính Kanotes với sự kiện và ghi chú'
)
const tell = shot(
  4,
  'Telling Kapy a plan in your own words',
  'Kể cho Kapy một kế hoạch theo cách của bạn'
)

// How Vietnamese chat phrases read, as Kapy understands them.
const phrases = [
  { said: 'Mai 8h cf nha', vi: 'ngày mai, 08:00', en: 'tomorrow, 08:00' },
  {
    said: 'thứ 6 tuần sau 7h tối',
    vi: 'thứ Sáu tuần sau, 19:00',
    en: 'next Friday, 19:00'
  },
  {
    said: 'mốt 9h30',
    vi: 'ngày kia, 09:30',
    en: 'the day after tomorrow, 09:30'
  },
  { said: '20/11 2h chiều', vi: '20/11, 14:00', en: '20 Nov, 14:00' }
]

export default function KanotesPage() {
  return (
    <>
      <section className="k-hero">
        <div className="k-wrap k-split">
          <div>
            <h1>
              <T
                vi="Một chạm, Kapy lưu giúp bạn nha"
                en="One click, Kapy saves it for you"
              />
            </h1>
            <p className="k-lede">
              <T
                vi="Tin nhắn hẹn cà phê, email báo lịch họp, trang web có ngày sự kiện… Giữ phím bên, Kapy đọc màn hình và đưa bạn một sự kiện lịch hoặc ghi chú đã điền sẵn."
                en="A chat about coffee, an email about a meeting, a web page with a date… Hold the side button, and Kapy reads the screen and hands you a calendar event or a note, already filled in."
              />
            </p>
            <StoreBadge />
            <ul className="k-facts">
              <li>
                <Icon name="check" size={18} />
                <T vi="Đọc ngay trên điện thoại" en="Reads on your phone" />
              </li>
              <li>
                <Icon name="check" size={18} />
                <T vi="Tiếng Việt & English" en="Vietnamese & English" />
              </li>
              <li>
                <Icon name="check" size={18} />
                Android
              </li>
            </ul>
          </div>
          <div className="k-art">
            <div className="k-disc" aria-hidden="true" />
            <PhoneFrame {...card} hero eager />
          </div>
        </div>
      </section>

      <section className="k-section k-band">
        <div className="k-wrap">
          <h2 className="k-h2">
            <T
              vi="Từ tin nhắn vào lịch, trong vài giây"
              en="From a message to your calendar, in seconds"
            />
          </h2>
          <p className="k-text">
            <T
              vi="Giữ phím bên trên bất kỳ màn hình nào. Hoặc chia sẻ chữ hay ảnh vào Kanotes, dùng ô Cài đặt nhanh, hay chạm tiện ích để đọc chữ vừa sao chép."
              en="Hold the side button on any screen. Or share text or an image to Kanotes, use the Quick Settings tile, or tap the widget to read what you just copied."
            />
          </p>
          <div className="k-flow">
            <div className="k-flow-step">
              <p className="k-bubble" lang="vi">
                <span className="k-bubble-name">Lan</span>
                Thứ 7 này 6h chiều đá bóng ở sân Chảo Lửa nha mọi người
              </p>
              <p className="k-flow-caption">
                <strong>
                  <T vi="Bạn bè nhắn" en="A friend texts" />
                </strong>
                <T
                  vi="trong nhóm chat, email hay trang web"
                  en="in a chat, an email or on a web page"
                />
              </p>
            </div>
            <span className="k-flow-arrow">
              <Icon name="arrowRight" size={28} />
            </span>
            <div className="k-flow-step">
              <PhoneFrame {...reading} small />
              <p className="k-flow-caption">
                <strong>
                  <T vi="Kapy đọc" en="Kapy reads it" />
                </strong>
                <T vi="ngay trên điện thoại" en="right on your phone" />
              </p>
            </div>
            <span className="k-flow-arrow">
              <Icon name="arrowRight" size={28} />
            </span>
            <div className="k-flow-step">
              <div className="k-event">
                <span className="k-event-icon">
                  <Icon name="calendar" size={22} />
                </span>
                <span>
                  <span className="k-event-title" lang="vi">
                    Đội bóng thứ 7
                  </span>
                  <span className="k-event-when">
                    <T vi="Thứ 7 · 18:00" en="Saturday · 18:00" />
                  </span>
                  <span className="k-event-where" lang="vi">
                    <Icon name="pin" size={16} />
                    sân Chảo Lửa
                  </span>
                </span>
              </div>
              <p className="k-flow-caption">
                <strong>
                  <T vi="Bạn kiểm tra rồi lưu" en="You check it and save" />
                </strong>
                <T
                  vi="vào lịch “Kanotes”, nhắc trước 30 phút"
                  en="to the “Kanotes” calendar, with a reminder"
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="k-section">
        <div className="k-wrap k-split">
          <div>
            <h2 className="k-h2">
              <T
                vi="Hiểu cách người Việt nhắn tin"
                en="Made for Vietnamese chats"
              />
            </h2>
            <p className="k-text">
              <T
                vi="Kapy hiểu cả khi gõ không dấu. Ngày đọc theo kiểu Việt Nam: ngày trước, tháng sau."
                en="Kapy gets the way people really text, accents or not. Dates are read day first, the Vietnamese way."
              />
            </p>
            <ul className="k-phrases">
              {phrases.map(phrase => (
                <li key={phrase.said} className="k-phrase">
                  <span className="k-said" lang="vi">
                    {phrase.said}
                  </span>
                  <Icon name="arrowRight" size={18} />
                  <span className="k-read">
                    <T vi={phrase.vi} en={phrase.en} />
                  </span>
                </li>
              ))}
            </ul>
            <p className="k-note">
              <T
                vi="Giờ không ghi sáng hay tối thì Kapy chọn giờ gần nhất sắp tới. Sự kiện vào lịch “Kanotes” riêng; ghi chú ở lại trong Kanotes và tự dọn sau số ngày bạn chọn."
                en="When a time doesn't say morning or evening, Kapy picks the one that comes sooner. Events go to their own “Kanotes” calendar; notes stay in Kanotes and tidy themselves up after the days you choose."
              />
            </p>
          </div>
          <div className="k-art">
            <div className="k-disc" aria-hidden="true" />
            <PhoneFrame {...home} />
          </div>
        </div>
      </section>

      <section className="k-section k-band">
        <div className="k-wrap k-split k-split--flip">
          <div>
            <h2 className="k-h2">
              <T
                vi="Hoặc kể cho Kapy theo cách của bạn"
                en="Or tell Kapy in your own words"
              />
            </h2>
            <p className="k-text">
              <T
                vi="Chạm nút + trong Kanotes rồi gõ như nhắn cho bạn bè, kiểu “Mai 8h cf voi Lan o quan May nha”. Kapy điền phần còn lại. Muốn tự làm? Chọn Tự điền."
                en="Tap + in Kanotes and type it the way you'd text a friend, like “Mai 8h cf voi Lan o quan May nha”. Kapy fills in the rest. Rather do it yourself? Choose Fill it in myself."
              />
            </p>
          </div>
          <div className="k-art">
            <div className="k-disc" aria-hidden="true" />
            <PhoneFrame {...tell} />
          </div>
        </div>
      </section>

      <section className="k-section">
        <div className="k-wrap k-private">
          <div>
            <span className="k-mark">
              <Icon name="lock" size={30} />
            </span>
            <h2 className="k-h2">
              <T vi="Riêng tư ngay từ đầu" en="Private from the start" />
            </h2>
            <p className="k-text">
              <T
                vi="Mặc định Kapy đọc ngay trên điện thoại, bằng Gemini Nano, hoặc Gemma trên máy không có Nano. Chữ trên màn hình không rời khỏi điện thoại."
                en="By default Kapy reads right on your phone, with Gemini Nano, or Gemma on phones without Nano. What's on your screen doesn't leave your phone."
              />
            </p>
            <ul className="k-checks">
              <li>
                <Icon name="check" size={18} />
                <T vi="Không cần tài khoản" en="No account" />
              </li>
              <li>
                <Icon name="check" size={18} />
                <T vi="Không quảng cáo" en="No ads" />
              </li>
              <li>
                <Icon name="check" size={18} />
                <T vi="Không theo dõi" en="No tracking" />
              </li>
            </ul>
            <Link href="/apps/kanotes/privacy" className="k-link">
              <T
                vi="Đọc chính sách quyền riêng tư"
                en="Read the privacy policy"
              />
              <Icon name="arrowRight" size={18} />
            </Link>
          </div>
          <aside className="k-cloud">
            <h3>
              <Icon name="cloud" size={28} />
              <T
                vi="Kanotes Cloud, nếu bạn muốn"
                en="Kanotes Cloud, if you want it"
              />
            </h3>
            <p>
              <T
                vi="Gói đăng ký không bắt buộc, cho điện thoại không chạy được Kapy, hoặc khi bạn muốn Kapy nhanh và chính xác hơn: Gemini trên đám mây của Google đọc giúp bạn, tối đa 300 lượt mỗi tháng."
                en="An optional subscription for phones that can't run Kapy, or for quicker, sharper reads: Gemini in Google's cloud reads for you, up to 300 times a month."
              />
            </p>
            <p>
              <T
                vi="Chỉ khi đó chữ trên màn hình mới được gửi đến Google. Hủy bất cứ lúc nào trên Google Play."
                en="Only then is the text on your screen sent to Google. Cancel any time in Google Play."
              />
            </p>
          </aside>
        </div>
      </section>

      <section className="k-section k-band">
        <div className="k-wrap k-closing">
          <Image
            src="/apps/kanotes/kapy.svg"
            alt=""
            width={112}
            height={100}
            unoptimized
          />
          <h2 className="k-h2">
            <T
              vi="Kapy sắp có mặt trên Google Play"
              en="Kapy is on its way to Google Play"
            />
          </h2>
          <StoreBadge center />
        </div>
      </section>

      <footer className="k-foot k-band">
        <Link href="/apps" className="k-back">
          <Icon name="arrowLeft" size={18} />
          <T vi="Ứng dụng của tôi" en="My apps" />
        </Link>
      </footer>
    </>
  )
}
