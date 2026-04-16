/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Landmark,
  ChevronRight,
  Settings
} from 'lucide-react';
import { personas, generateDialogue } from './services/geminiService';
import { SmartTextRenderer } from './utils/textRenderer';
import { AdminPanel } from './pages/Admin';
import { setSEOMetaTags, setStructuredData, organizationSchema, webAppSchema, creativeWorkSchema } from './utils/seo';

const QUOTES = [
  {
    id: 1,
    title: { vi: "Ba Vấn Đề Lớn", en: "Three Major Problems" },
    category: { vi: "Chỉ ra 3 vấn đề lớn", en: "Three core problems" },
    text: {
      vi: "Nhưng có một điều rất quan-hệ, rất cốt-yếu cho sự khai-hóa dân tôi mà Chánh-phủ Bảo-hộ hoặc chưa lưu-tâm đến, hoặc đã lưu-tâm đến mà không muốn sửa đổi ngay. Điều đó là: Cái tệ quan-trường, cái bệnh dân sự, cái hủ phong-tục. Có phải ba điều đó rất quan-hệ đến vận-mệnh nước Nam, mà Chánh-phủ cứ để hư-hỏng như thế chưa bao giờ xét đến chăng?",
      en: "But there is one matter most vital to the enlightenment of my people that the Protectorate Government has either not attended to, or has attended to but refused to remedy at once. That matter is: the malady of officialdom, the sickness of civil society, the decadence of custom. Are these not three things most consequential to the fate of our country, which the Government leaves to rot without ever examining?"
    },
    context: {
      vi: "Trích Quốc Gia Huyết Lệ (1906) — nêu ba căn bệnh trọng yếu của xã hội Việt Nam đương thời.",
      en: "Excerpt from 'Tears of the Nation' (1906) — naming three cardinal ills of Vietnamese society."
    }
  },
  {
    id: 2,
    title: { vi: "Trí Thức Bỏ Nước Ra Đi", en: "Intellectuals Flee the Country" },
    category: { vi: "Tệ quan trường — Bệnh dân sự", en: "Bureaucratic malady — Civil sickness" },
    text: {
      vi: "Đau lòng vì nước đốn, dân suy, nên người trí-thức quả quyết phải chạy Đông, cầu Tây, mong ra được ngoài, lăn lóc với người mà không dám về nữa; còn hạng tri-thức nhu-nhược thì đành lần-khuất trong chốn hương thôn mà chịu im hơi nín tiếng. Hỏi có ai đã dám tới cửa quan Bảo-hộ mà mở buồng gan, tia mạch máu, giãi bày những cái tệ của quan-trường, những cái khổ của dân-sự, vì thế mà nước Nam thành ra một nước có bịnh nguy-kịch không thể chữa được.",
      en: "Grieved by the nation's decay and the people's decline, the resolute intellectuals flee East or beg West, longing to go abroad, to struggle among strangers rather than return; while the timid among the learned hide away in remote villages, keeping silent and breathless. Who has dared come to the Protectorate's gate, open their liver, draw from their veins, to lay bare the ills of officialdom and the sufferings of civil life? Thus our country has become a land of critical, incurable disease."
    },
    context: {
      vi: "Phê phán sự im lặng của tầng lớp trí thức trước tệ nạn quan trường và nỗi khổ dân chúng.",
      en: "Criticizing the silence of the intellectual class in the face of official corruption and popular suffering."
    }
  },
  {
    id: 3,
    title: { vi: "Nhà Nước Đãi Người Như Cầm Thú", en: "The State Treats People Like Beasts" },
    category: { vi: "Tệ quan trường", en: "Bureaucratic malady" },
    text: {
      vi: "Bây giờ nước Nam, trừ những đám quan-trường, còn hầu hết không cứ gì người khôn kẻ dại, ai cũng than rằng nhà nước Bảo-hộ đải người Nam như là cầm thú, chẳng chút nhân loại dung thứ cho bọn quan-lại đã không biết làm lợi cho dân lại còn hại dân, thế là lỗi tại các quan Bảo hộ vì đã mặc sức cho người Annam hành hạ dân Annam, tàn hại lẫn nhau coi nhau như hàng cá hàng thịt, làm cho nòi giống chóng tiêu-diệt để nhà nước Đại-Pháp rễ cai trị và dễ di-dân.",
      en: "Today in our country, apart from the officialdom, virtually everyone — wise or foolish alike — laments that the Protectorate treats the Vietnamese like beasts, without a shred of humanity, tolerating officials who not only fail to benefit the people but actively harm them. The fault lies with the Protectorate officials who have given free rein to Vietnamese to torment Vietnamese, to ravage one another as if they were mere fish and meat in the market, hastening the extermination of our race so that France may rule and colonize with ease."
    },
    context: {
      vi: "Tố cáo chính sách đồng lõa của Bảo hộ với bộ máy quan lại tham nhũng hại dân.",
      en: "Denouncing the Protectorate's complicity with a corrupt official apparatus that preys on the people."
    }
  },
  {
    id: 4,
    title: { vi: "Bốn Mươi Năm Vận Nước Đồ Nát", en: "Forty Years of National Ruin" },
    category: { vi: "Tệ quan trường", en: "Bureaucratic malady" },
    text: {
      vi: "Nước Nam hơn bốn mươi năm nay, vận nước đồ nát, trên dưới lặng ngắt, phép tắc sạch không, nhơn tài vắng lạnh. Người làm quan trên lâu năm được tăng một chức to, người làm quan dưới chạy chọt đút lót cho chóng thăng hàm, lâu thành thói quen, người nào muốn làm quan thời phải nín hơi quỳ gối ở chốn quyền-môn, kẻ ở làng-mạc thời mượn thế nạt nộ ngu dân ở trong chốn hương-đảng.",
      en: "For over forty years our country has been shattered, silenced from top to bottom, stripped of all law and order, bereft of talent. Senior officials gain rank through seniority; junior ones bribe their way to promotion — a habit so ingrained that whoever wishes to serve must hold their breath and kneel at the gates of power, while those in the villages exploit influence to bully the ignorant in their local councils."
    },
    context: {
      vi: "Mô tả thực trạng hệ thống quan liêu mục nát sau bốn mươi năm thuộc địa.",
      en: "Depicting the decayed bureaucratic system after four decades of colonial rule."
    }
  },
  {
    id: 5,
    title: { vi: "Ta Chỉ Lấy Người Việt Trị Việt", en: "We Use Vietnamese to Rule Vietnamese" },
    category: { vi: "Tệ quan trường", en: "Bureaucratic malady" },
    text: {
      vi: "Hay là Nhà-nước nghỉ rằng: tục nước Nam không biết được ngay, lực người Nam không làm gì nổi, thôi ta cầm lấy quyền bính nước nó, nguyên để Triều-đình nước nó đấy, để quan lại nó đấy, đặng ta sai khiến, thâu vét sưu thuế, sai làm công việc, còn dẫn nó nước nó thể nào chả cần hỏi chi, cũng như câu nói rằng: Ta chỉ lấy người Việt-Nam, ta trị Việt-Nam mà thôi.",
      en: "Or perhaps the Government reasons thus: the customs of our country are not readily understood; the capacity of our people is too limited to accomplish anything — so let us seize power, leave their Court in place, leave their officials in place, so we may command them, extract taxes, assign labor, and never trouble ourselves with how their nation fares — summed up by that saying: We simply use Vietnamese, we govern Vietnam, and nothing more."
    },
    context: {
      vi: "Phơi bày logic của chủ nghĩa thực dân — dùng chính bộ máy bản địa để vơ vét và kiểm soát.",
      en: "Exposing the logic of colonialism — using the indigenous apparatus itself to extract and control."
    }
  },
  {
    id: 6,
    title: { vi: "Bảo Hộ Dung Túng Quan Lại", en: "The Protectorate Shelters Corrupt Officials" },
    category: { vi: "Tệ quan trường", en: "Bureaucratic malady" },
    text: {
      vi: "Nước Nam dẫu pháp-luật tuy không hay thiệt, những cái điều trừng-trị quan lại cũng còn đủ đem ra mà trị quan-lại được, thế mà nhà nước Bảo-hộ chỉ đem cái hình thảm độc trị ngu-dân mà thôi còn quan-lại thì chỉ sơ sài, cho nên cái tệ nó càng ngày càng quả mãi ra, chỉ tại Bảo-hộ dung túng quan-lại cho nên đến nổi vậy.",
      en: "Our country's laws, though imperfect, still contain provisions sufficient to discipline officials; yet the Protectorate applies its harshest punishments only to the ignorant masses while dealing with officials only perfunctorily — so the malady grows worse with each passing day. This is solely because the Protectorate shelters the officials, and thus it has come to such a state."
    },
    context: {
      vi: "Chỉ ra sự bất bình đẳng trước pháp luật: dân bị trừng phạt nặng, quan lại được bảo kê.",
      en: "Pointing out legal inequality: the people punished harshly, officials shielded from accountability."
    }
  },
  {
    id: 7,
    title: { vi: "Khinh Dân Là Nước Dã Nam", en: "Contempt: A Barbarian Nation" },
    category: { vi: "Tệ quan trường", en: "Bureaucratic malady" },
    text: {
      vi: "Quan Đại-pháp cùng với người Việt-Nam ở đã lâu, thấy rằng quan-lại thời tham, sỉ-dân thời ngu, phong tục đồi bại, khinh là cái nước không có tư cách quốc dân, nên khi viết báo, khi truyền vào thơ, khi bàn luận, khi truyện trò cũng đều có cái tư tưởng chán nản cả, cho là một nước dã nam, không thề bình đẳng được.",
      en: "French officials, having lived long among the Vietnamese, see that officials are corrupt, the common people ignorant, and customs degenerate — and so they look down upon this country as lacking national character. Whether writing in newspapers, composing verse, debating, or conversing, they all share that same wearied contempt, pronouncing it a barbarous nation incapable of equality."
    },
    context: {
      vi: "Mô tả hệ quả của tham nhũng quan trường lên hình ảnh dân tộc trong mắt người Pháp.",
      en: "Describing how official corruption shapes the colonial image of the Vietnamese nation."
    }
  },
  {
    id: 8,
    title: { vi: "Mẹo Của Quan Lại", en: "The Officials' Cunning" },
    category: { vi: "Tệ quan trường", en: "Bureaucratic malady" },
    text: {
      vi: "Quan-lại Việt-Nam nhơn thừa dịp Bảo-hộ cách thế, thành ra một cái tệ làm hại dân. Nhà nước Bảo-hộ với nước Nam thời tình-ý không hợp nhau, lợi hại cũng khác nhau, cùng những quan-lại tình tệ như trên tôi đã nói cả, vi bằng không có cách gì thì Bảo-hộ đã ở lâu, đã biết thấu rõ các tình cảnh sỉ-dân vì nổi đầy đọa chịu không được phải bỏ đi xa, thời người Pháp, người Nam cũng như một người mà quan-lại không thò cái gian ra được.",
      en: "Vietnamese officials, taking advantage of the Protectorate's methods, have become a malady that harms the people. The interests of the Protectorate and those of Vietnam are incompatible, their benefits and harms diverge — together with the corrupt officials I have described. Were it not for these maneuvers, the Protectorate, having been here long and knowing well the people's misery, the French and Vietnamese might become as one — and officials would find no room to practice their deceit."
    },
    context: {
      vi: "Phân tích cách quan lại lợi dụng khoảng cách giữa Bảo hộ và dân để thủ lợi.",
      en: "Analyzing how officials exploit the gulf between the Protectorate and the people for personal gain."
    }
  },
  {
    id: 9,
    title: { vi: "Lấy Quan Trường Làm Chợ", en: "Officialdom as Marketplace" },
    category: { vi: "Tệ quan trường", en: "Bureaucratic malady" },
    text: {
      vi: "Than ôi! nước Nam không phải là dã-man, bán-khai gì mấy nghìn năm nay, sách vỡ chất thành non, văn-hoá ngày một tiến; ai cũng hiểu yêu dân là công, hại dân là tội; các quan Annam là người học thức cao-thâm mà sao nở lấy quan trường làm chợ, coi nhân dân như cá thịt, bảo những người lo cho dân là cuồng, làm lợi cho dân là nghịch đến nổi bây giờ phải, trái bất phân mà các quan vẫn một mực không kiêng sợ gì.",
      en: "Alas! Vietnam is no barbarian land — for thousands of years books have piled like mountains and culture advanced daily; everyone understands that loving the people is merit and harming them is crime. Yet our learned officials, educated and refined, how can they bear to turn the court into a marketplace, treat the people as fish and meat in a stall, denounce those who care for the people as fanatics, and call those who benefit the people rebels — to the point that right and wrong are now indistinguishable, and the officials remain utterly unafraid?"
    },
    context: {
      vi: "Lời ai oán về sự đảo lộn giá trị trong giới quan lại — kẻ học cao mà hành xử thấp.",
      en: "A lament over the inversion of values among the official class — the educated behaving basely."
    }
  },
  {
    id: 10,
    title: { vi: "Cửa Quan Là Chỗ Tốn Tiền", en: "The Official's Gate Costs Money" },
    category: { vi: "Tệ quan trường", en: "Bureaucratic malady" },
    text: {
      vi: "Bởi vậy dân tình gián-cách, sỉ-khí cùng suy, thế quan càng thịnh. Trong một phủ-huyện, không kể là việc trộm cướp, kiện tụng, nhơn-mạng cũng là tìm việc kiếm tiền. Cho nên vài mươi năm nay cái tình trạng dân gian sầu khổ, hễ bước tới cửa quan là tốn tiền, dù việc lớn việc nhỏ, việc hoãn việc cấp, hễ được mảnh giấy của quan Bảo hộ thời quí như vàng ngọc, gìn giữ như cái bùa thiêng.",
      en: "Thus the people grow estranged, popular spirit declines together, and official power grows ever more flourishing. Within a prefecture or district, whether the matter concerns robbery, litigation, or homicide, it is all occasion to extract money. So for decades now the condition of the common people has been one of grief: every step toward an official gate costs money, whether the affair is great or small, urgent or deferred; a single slip of paper from a Protectorate official is treasured like gold and jade, kept as a sacred talisman."
    },
    context: {
      vi: "Miêu tả thực trạng người dân phải mua từng tờ giấy, từng dấu con quan — nền hành chính tham nhũng toàn diện.",
      en: "Depicting ordinary people forced to pay for every document and seal — a totally corrupt administration."
    }
  },
  {
    id: 11,
    title: { vi: "Khai Hóa Như Cho Trẻ Đồ Chơi", en: "Civilization Like a Toy for Children" },
    category: { vi: "Tệ quan trường", en: "Bureaucratic malady" },
    text: {
      vi: "Các quan Bảo hộ lấy tiếng là theo chánh-sách mới mà nhũng lạm nhân-dân, chẳng qua chiếu lệ cho xong việc, kỳ thực kiếm truyện hại dân, khác nào vẽ mây ngũ sắc trên đất bùn, bày đồ cao lương mỹ-vị trên bàn dơ bẩn. Khai-hóa như thế khoan-đải như thế có khác nào thấy đứa trẻ khóc mà cho nó cái đồ chơi, thấy dân đói mà cho cái mỏ vàng. Đồ chơi ấy, mỏ vàng ấy, đã vô dụng, lại còn gợi tấm lòng ngờ vực, cái chính sách kinh lý đó thật chẳng có ảnh hưởng gì!",
      en: "The Protectorate officials, claiming to follow the new policy, exploit and oppress the people — doing no more than going through the motions — while in truth they seek pretexts to harm them. It is like painting five-colored clouds upon mud, or laying out a fine banquet on a filthy table. Such civilization, such benevolence — is it any different from seeing a child weep and giving it a toy, or seeing hungry people and handing them a gold mine? That toy, that gold mine — useless, and yet breeding distrust; such a governing policy truly has no effect at all!"
    },
    context: {
      vi: "Tố cáo chiêu bài 'khai hóa' của thực dân là trò che mắt, không mang lại lợi ích thực sự cho dân.",
      en: "Denouncing colonial 'civilization' as a facade, bringing no real benefit to the people."
    }
  },
  {
    id: 12,
    title: { vi: "Học Thuật Không Tỉnh, Phong Tục Đồi Bại", en: "Learning Dormant, Customs Degenerate" },
    category: { vi: "Bệnh dân sự — Hủ phong tục", en: "Civil sickness — Backward customs" },
    text: {
      vi: "Nước Nam lâu nay học thuật không tỉnh, phong tục đòi bại, liêm-sỉ không còn, người kiến-thức một ngày một hiếm, dân một làng coi nhau như cá thịt, người một nước coi nhau như thù hằn, dầu có người có dị chí đi nữa, cũng không có nơi làm cơ sở; không có khí giải súng đạn và cũng không có tiền nữa.",
      en: "For a long time our country's scholarship has been dormant, customs have degenerated, integrity has vanished, and men of knowledge grow rarer by the day. People in one village regard each other as fish and meat; people of one nation regard each other as enemies. Even if a man of extraordinary resolve should arise, he has no base from which to work — no weapons, no ammunition, no money."
    },
    context: {
      vi: "Chỉ ra sự suy kiệt toàn diện: trí tuệ, đạo đức và tinh thần đoàn kết đều cạn kiệt.",
      en: "Pointing to total depletion — of intellect, of morality, and of collective spirit."
    }
  },
  {
    id: 13,
    title: { vi: "Tầm Thường Toàn-quyền, Bỏ Qua Tệ Nạn", en: "Governors General Ignore the Malady" },
    category: { vi: "Tệ quan trường", en: "Bureaucratic malady" },
    text: {
      vi: "Tôi thường coi các báo Đông-Kinh, đọc những bài diễn-văn của các quan Toàn quyền, các ngài đều tỏ ý muốn khoan đãi người Annam, khai hóa cho nước Nam về hình-luật, về việc học, cùng là vài việc khác nữa, thì đã có sửa đổi, mở mang, mà sao đến cái tình-tệ quan-lại, sưu thuế nặng nề thì chẳng xét đến?",
      en: "I often read the Tonkin newspapers and the speeches of the Governors General; they all express a wish to treat the Vietnamese generously, to enlighten the country in matters of law and education, and in various other matters some reforms and openings have indeed been made — yet why is it that the corruption of officialdom and the heavy burden of taxes are never examined?"
    },
    context: {
      vi: "Vạch trần sự mâu thuẫn giữa lời nói cải cách của các Toàn quyền và thực tế quan lại tham nhũng bị bỏ qua.",
      en: "Exposing the contradiction between Governors General's reformist rhetoric and the unpunished reality of official corruption."
    }
  }
];

function getQuotes() {
  try {
    const adminQuotes = localStorage.getItem('quotes');
    if (adminQuotes) {
      const parsed = JSON.parse(adminQuotes);
      // Merge admin quotes with defaults, preferring admin versions
      const adminIds = new Set(parsed.map((q: any) => q.id));
      const defaults = QUOTES.filter(q => !adminIds.has(q.id));
      return [...parsed, ...defaults];
    }
  } catch (e) {
    console.error('Failed to load admin quotes:', e);
  }
  return QUOTES;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'context' | 'characters' | 'dialogue'>('intro');
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [allQuotes, setAllQuotes] = useState(getQuotes());
  const [selectedQuote, setSelectedQuote] = useState(getQuotes()[0]);
  const [activePersona, setActivePersona] = useState<keyof typeof personas | null>(null);
  const [dialogues, setDialogues] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuoteList, setShowQuoteList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const handlePersonaClick = async (key: keyof typeof personas) => {
    setActivePersona(key);
    setIsGenerating(true);
    setError(null);

    try {
      let text = dialogues[`${selectedQuote.id}-${key}-${lang}`];
      if (!text) {
        text = await generateDialogue(selectedQuote.text[lang], key, lang);
        setDialogues(prev => ({ ...prev, [`${selectedQuote.id}-${key}-${lang}`]: text }));
      }
    } catch (error: any) {
      setError(lang === 'vi' ? "Có lỗi xảy ra khi kết nối API. Vui lòng thử lại." : "API connection error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Initialize SEO on component mount
  useEffect(() => {
    setSEOMetaTags();
    setStructuredData(organizationSchema);
    setStructuredData(webAppSchema);
    setStructuredData(creativeWorkSchema);
  }, []);

  const nextStep = () => {
    if (currentStep === 'intro') setCurrentStep('context');
    else if (currentStep === 'context') setCurrentStep('characters');
    else if (currentStep === 'characters') setCurrentStep('dialogue');
  };

  const prevStep = () => {
    if (currentStep === 'context') setCurrentStep('intro');
    else if (currentStep === 'characters') setCurrentStep('context');
    else if (currentStep === 'dialogue') setCurrentStep('characters');
  };

  return (
    <div className="relative min-h-screen magazine-canvas overflow-hidden flex flex-col lg:pl-16">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-16 hidden lg:flex flex-col items-center justify-between py-12 border-r border-vermilion/10 z-50 bg-paper">
        <div className="header-vertical text-vermilion font-bold tracking-[0.2em] text-xs uppercase opacity-60">
          QUỐC GIA TAM THOẠI
        </div>
        <button
          onClick={() => setCurrentStep('intro')}
          className="size-8 text-vermilion/40 hover:text-vermilion transition-colors"
          title={lang === 'vi' ? "Về trang chủ" : "Go to homepage"}
        >
          <Landmark className="w-8 h-8" />
        </button>
      </aside>

      {/* Header */}
      <header className="px-4 md:px-8 lg:px-24 py-4 md:py-8 relative z-40 flex justify-between items-center gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <h2 className="text-vermilion text-xl md:text-2xl font-black italic tracking-tight cursor-pointer" onClick={() => setCurrentStep('intro')}>QGTT.</h2>
          <div className="h-px w-8 md:w-12 bg-vermilion/20 hidden md:block"></div>
          <span className="text-[0.55rem] md:text-[0.6rem] uppercase font-bold tracking-[0.2em] md:tracking-[0.3em] text-vermilion/60 hidden md:block">
            {currentStep === 'intro' && (lang === 'vi' ? "Khởi đầu" : "Intro")}
            {currentStep === 'context' && (lang === 'vi' ? "Bối cảnh lịch sử" : "Historical Context")}
            {currentStep === 'characters' && (lang === 'vi' ? "Tiếng nói trí thức" : "Voices of Intellectuals")}
            {currentStep === 'dialogue' && (lang === 'vi' ? "Tam thoại duy tân" : "Modernizing Dialogue")}
          </span>
        </div>
        <div className="flex items-center gap-3 md:gap-8">
          {/* Mobile step dots */}
          <div className="flex md:hidden gap-1.5">
            {['intro', 'context', 'characters', 'dialogue'].map((s) => (
              <div key={s} className={`h-1 transition-all duration-500 rounded-full ${currentStep === s ? 'bg-vermilion w-4' : 'bg-vermilion/20 w-1.5'}`} />
            ))}
          </div>
          <button
            onClick={() => setShowAdmin(true)}
            className="p-1.5 md:p-2 text-vermilion hover:bg-vermilion/5 rounded transition-colors"
            title="Admin Panel"
          >
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <div className="flex bg-vermilion/5 border border-vermilion/10 p-0.5 rounded-sm">
            <button
              onClick={() => setLang('vi')}
              className={`px-2 md:px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest transition-colors ${lang === 'vi' ? 'bg-vermilion text-paper' : 'text-vermilion hover:bg-vermilion/10'}`}
            >
              VN
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 md:px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest transition-colors ${lang === 'en' ? 'bg-vermilion text-paper' : 'text-vermilion hover:bg-vermilion/10'}`}
            >
              EN
            </button>
          </div>
          <div className="hidden md:flex gap-2">
            {['intro', 'context', 'characters', 'dialogue'].map((s) => (
              <div key={s} className={`h-1 w-8 transition-all duration-500 ${currentStep === s ? 'bg-vermilion' : 'bg-vermilion/10'}`} />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <motion.section
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full relative flex items-center overflow-hidden"
            >
              {/* Full-bleed background image */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Backround%20Qu%E1%BB%91c%20Gia%20Tam%20tho%E1%BA%A1i.png-08y7VU4Hf2lvzo13UfUm3fO6NO4blg.jpeg"
                  alt="Vietnamese heritage background"
                  className="w-full h-full object-cover"
                />
                {/* Right-side vignette so text stays readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-paper/10 via-paper/30 to-paper/80" />
              </div>

              {/* Content */}
              <div className="relative z-10 w-full px-5 md:px-8 lg:px-24 py-8 md:py-12">
                <div className="flex justify-center md:justify-end">
                  <div className="max-w-xl w-full space-y-6 md:space-y-10">
                    <div className="space-y-2">
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-vermilion/70">
                        {lang === 'vi' ? "Quốc Gia Huyết Lệ — Ba Tiếng Nói" : "Tears of the Nation — Three Voices"}
                      </p>
                      <h1 className="text-vermilion text-4xl md:text-5xl lg:text-6xl font-black leading-tight uppercase tracking-tighter text-balance">
                        Quốc Gia<br />
                        <span className="italic">Tam Thoại</span>
                      </h1>
                    </div>

                    <p className="text-deep-brown text-base md:text-xl font-medium leading-relaxed border-l-2 border-vermilion pl-4 md:pl-6 py-2 max-w-sm">
                      {lang === 'vi'
                        ? "Đọc Quốc Gia Huyết Lệ qua ba tiếng nói cải cách tiêu biểu của lịch sử."
                        : "Reading 'Tears of the Nation' through three representative reformist voices of history."}
                    </p>

                    {/* Three persona mini badges */}
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {Object.values(personas).map((p) => (
                        <div key={p.name.vi} className="flex items-center gap-2 border border-vermilion/30 bg-paper/70 px-2 md:px-3 py-1.5 md:py-2 backdrop-blur-sm">
                          <div className="size-6 md:size-7 rounded-full overflow-hidden border border-vermilion/30 flex-shrink-0">
                            <img src={p.image} alt={p.name[lang]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <span className="text-[0.55rem] md:text-[0.6rem] font-bold uppercase tracking-widest text-deep-brown">{p.name[lang]}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={nextStep}
                      className="bg-vermilion text-paper px-8 md:px-12 py-4 md:py-5 font-bold text-xs md:text-sm uppercase tracking-[0.2em] hover:translate-x-2 transition-transform flex items-center gap-3 md:gap-4 shadow-xl"
                    >
                      {lang === 'vi' ? "Bắt đầu hành trình" : "Start Journey"} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {currentStep === 'context' && (
            <motion.section
              key="context"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="px-5 md:px-8 lg:px-24 py-8 md:py-12 h-full overflow-y-auto flex items-start md:items-center"
            >
              <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12">
                <div className="lg:w-64 flex-shrink-0">
                  <h2 className="text-vermilion text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none">
                    {lang === 'vi' ? "Vấn đề" : "Central"}<br />{lang === 'vi' ? "trung tâm" : "Issues"}
                  </h2>
                  <div className="h-1 w-16 bg-vermilion mt-6 mb-8"></div>
                  <p className="text-deep-brown text-base italic opacity-70 max-w-xs">
                    {lang === 'vi'
                      ? "Ba rào cản lớn nhất kìm hãm dân tộc Việt Nam đầu thế kỷ XX."
                      : "The three greatest barriers hindering the Vietnamese nation in the early 20th century."}
                  </p>
                  <div className="mt-8 flex gap-3">
                    <button onClick={prevStep} className="border border-vermilion text-vermilion p-3 hover:bg-vermilion/5 transition-colors">
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <button onClick={nextStep} className="bg-vermilion text-paper px-6 py-3 font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                      {lang === 'vi' ? "Tiếp tục" : "Continue"} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {[
                    { num: "01.", title: lang === 'vi' ? "Tệ quan trường" : "Bureaucracy", desc: lang === 'vi' ? "Sự thối nát và trì trệ của hệ thống quan liêu phong kiến, rào cản lớn nhất cho mọi nỗ lực đổi mới đất nước." : "The corruption and stagnation of the feudal bureaucratic system, the greatest barrier to all national renewal efforts." },
                    { num: "02.", title: lang === 'vi' ? "Bệnh dân sự" : "Civil Illness", desc: lang === 'vi' ? "Những căn bệnh thâm căn cố đế trong tư duy, sự thụ động và thiếu tinh thần tự cường của dân chúng đương thời." : "Deep-rooted illnesses in thinking, passivity, and lack of self-reliance among the populace of the time." },
                    { num: "03.", title: lang === 'vi' ? "Hủ phong tục" : "Backward Customs", desc: lang === 'vi' ? "Những hủ tục lạc hậu, mê tín dị đoan và lối sống cũ kìm hãm sự phát triển của xã hội văn minh." : "Backward customs, superstitions, and old lifestyles hindering the development of a civilized society." }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-vermilion/5 p-6 border border-vermilion/10 space-y-4 hover:bg-vermilion/10 transition-colors">
                      <span className="text-vermilion font-bold text-3xl md:text-4xl">{item.num}</span>
                      <h3 className="text-base md:text-lg font-bold text-vermilion uppercase tracking-widest">{item.title}</h3>
                      <p className="text-deep-brown leading-relaxed italic opacity-80 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {currentStep === 'characters' && (
            <motion.section
              key="characters"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="px-5 md:px-8 lg:px-24 py-8 md:py-12 h-full overflow-y-auto flex flex-col justify-start md:justify-center"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-8 md:mb-16">
                <div>
                  <h2 className="text-vermilion text-3xl md:text-5xl lg:text-7xl font-black uppercase leading-none mb-3">
                    {lang === 'vi' ? "Tiếng nói" : "Voices of"}<br />{lang === 'vi' ? "Trí thức" : "Intellectuals"}
                  </h2>
                  <p className="max-w-md text-deep-brown/70 font-medium italic text-sm md:text-lg">
                    {lang === 'vi'
                      ? "Ba hệ tư tưởng tiêu biểu cùng hội tụ để giải bài toán canh tân đất nước."
                      : "Three representative ideologies converge to solve the problem of national modernization."}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={prevStep} className="border border-vermilion text-vermilion p-3 hover:bg-vermilion/5 transition-colors">
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <button onClick={nextStep} className="bg-vermilion text-paper px-6 py-3 font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                    {lang === 'vi' ? "Vào Tam Thoại" : "Enter Dialogue"} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {Object.entries(personas).map(([key, persona]) => (
                  <div key={key} className="group flex flex-col md:flex-col flex-row gap-4 md:gap-0">
                    <div className="relative mb-0 md:mb-8 flex-shrink-0 w-24 md:w-auto">
                      <div className="aspect-square md:aspect-[4/5] overflow-hidden grayscale contrast-125 transition-all duration-700 group-hover:grayscale-0 border-2 border-vermilion/30 group-hover:border-vermilion shadow-lg">
                        <img
                          alt={persona.name[lang]}
                          className="w-full h-full object-cover object-top"
                          src={persona.image}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center md:justify-start">
                      <h3 className="text-lg md:text-2xl font-black uppercase mb-1 tracking-tight text-vermilion leading-tight">{persona.name[lang]}</h3>
                      <p className="text-[0.6rem] font-medium uppercase tracking-widest text-deep-brown/40 mb-2">{persona.description[lang].split('.')[0]}</p>
                      <p className="text-deep-brown/70 text-xs md:text-sm leading-relaxed hidden md:block">{persona.description[lang].split('. ').slice(1).join('. ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {currentStep === 'dialogue' && (
            <motion.section
              key="dialogue"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full overflow-hidden flex flex-col"
            >
              <div className="flex-1 flex overflow-hidden min-h-0">

                {/* Left sidebar — desktop only */}
                <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-vermilion/15 overflow-y-auto bg-paper/60 flex-col">
                  <div className="px-5 pt-6 pb-3 border-b border-vermilion/10">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-vermilion/60">
                      {lang === 'vi' ? `${allQuotes.length} Trích đoạn` : `${allQuotes.length} Excerpts`}
                    </p>
                  </div>
                  <nav className="flex-1 py-2">
                    {allQuotes.map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setSelectedQuote(q);
                          setActivePersona(null);
                          setShowQuoteList(false);
                        }}
                        className={`w-full text-left px-5 py-3 flex items-start gap-3 border-l-2 transition-all group ${selectedQuote.id === q.id
                          ? 'border-vermilion bg-vermilion/8 text-vermilion'
                          : 'border-transparent hover:border-vermilion/30 hover:bg-vermilion/4 text-deep-brown/60 hover:text-deep-brown'
                          }`}
                      >
                        <span className={`text-[0.6rem] font-black font-mono mt-0.5 flex-shrink-0 tabular-nums ${selectedQuote.id === q.id ? 'text-vermilion' : 'text-deep-brown/30'}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-[0.7rem] font-bold uppercase tracking-wide leading-snug ${selectedQuote.id === q.id ? 'text-vermilion' : ''}`}>
                          {q.title[lang]}
                        </span>
                      </button>
                    ))}
                  </nav>
                </aside>

                {/* Right main area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-16 py-6 md:py-10">
                  {/* Mobile quote picker */}
                  <div className="md:hidden mb-4">
                    <button
                      onClick={() => setShowQuoteList(!showQuoteList)}
                      className="w-full flex items-center justify-between px-4 py-3 border border-vermilion/30 bg-paper text-left"
                    >
                      <span className="text-[0.65rem] font-bold uppercase tracking-widest text-vermilion">
                        {String(allQuotes.findIndex(q => q.id === selectedQuote.id) + 1).padStart(2, '0')} — {selectedQuote.title[lang]}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-vermilion transition-transform ${showQuoteList ? 'rotate-90' : ''}`} />
                    </button>
                    {showQuoteList && (
                      <div className="border border-t-0 border-vermilion/20 bg-paper max-h-56 overflow-y-auto">
                        {allQuotes.map((q, idx) => (
                          <button
                            key={q.id}
                            onClick={() => {
                              setSelectedQuote(q);
                              setActivePersona(null);
                              setShowQuoteList(false);
                            }}
                            className={`w-full text-left px-4 py-3 flex items-start gap-3 border-l-2 transition-all ${selectedQuote.id === q.id ? 'border-vermilion bg-vermilion/8 text-vermilion' : 'border-transparent text-deep-brown/60'}`}
                          >
                            <span className="text-[0.6rem] font-black font-mono mt-0.5 flex-shrink-0 tabular-nums text-deep-brown/30">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className={`text-[0.7rem] font-bold uppercase tracking-wide leading-snug ${selectedQuote.id === q.id ? 'text-vermilion' : ''}`}>
                              {q.title[lang]}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="max-w-3xl mx-auto flex flex-col gap-6 md:gap-10">

                    {/* Category badge + quote display */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedQuote.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="space-y-4 md:space-y-6"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-vermilion border border-vermilion/30 px-2 py-1">
                            {selectedQuote.category[lang]}
                          </span>
                        </div>

                        <div className="border border-vermilion/20 bg-white/40 p-5 md:p-10 space-y-4 md:space-y-6">
                          <div className="text-base md:text-xl lg:text-2xl font-medium text-deep-brown leading-relaxed">
                            <SmartTextRenderer
                              content={`"${selectedQuote.text[lang]}"`}
                              className="text-deep-brown"
                            />
                          </div>
                          <div className="border-t border-vermilion/10 pt-4 md:pt-6 space-y-2">
                            <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-vermilion">
                              {lang === 'vi' ? "Bối cảnh lịch sử" : "Historical Context"}
                            </p>
                            <SmartTextRenderer
                              content={selectedQuote.context[lang]}
                              className="text-sm text-deep-brown/70"
                            />
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Character Selection */}
                    <div>
                      <h3 className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-vermilion mb-4">
                        {lang === 'vi' ? "Chọn nhân vật" : "Select Character"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {Object.entries(personas).map(([key, persona]) => (
                          <button
                            key={key}
                            onClick={() => handlePersonaClick(key as keyof typeof personas)}
                            className={`p-4 border transition-all text-left ${activePersona === key ? 'bg-vermilion border-vermilion' : 'border-vermilion/20 hover:border-vermilion/50 hover:bg-vermilion/5'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="size-12 rounded-full overflow-hidden border border-current/20 flex-shrink-0">
                                <img
                                  src={persona.image}
                                  alt={persona.name[lang]}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <p className={`font-bold text-xs uppercase tracking-tight ${activePersona === key ? 'text-paper' : 'text-deep-brown'}`}>
                                  {persona.name[lang]}
                                </p>
                                <p className={`text-[0.65rem] opacity-70 mt-0.5 ${activePersona === key ? 'text-paper' : 'text-deep-brown'}`}>
                                  {persona.voiceDesc[lang]}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dialogue Display Section */}
                    {activePersona && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          {/* Quote Display */}
                          <div className="bg-white/40 border border-vermilion/10 p-6">
                            <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-vermilion/60 mb-3">
                              {lang === 'vi' ? "Trích dẫn gốc" : "Original Quote"}
                            </p>
                            <div className="text-base text-deep-brown leading-relaxed">
                              <SmartTextRenderer
                                content={`"${selectedQuote.text[lang]}"`}
                                className="text-deep-brown"
                              />
                            </div>
                          </div>

                          {/* Character Commentary */}
                          <AnimatePresence mode="wait">
                            {isGenerating ? (
                              <motion.div
                                key="loading"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="bg-deep-brown text-paper p-8 space-y-6"
                              >
                                {/* Header skeleton */}
                                <div className="flex items-center gap-3 pb-4 border-b border-paper/10">
                                  <div className="size-10 rounded-full overflow-hidden border border-paper/20 flex-shrink-0">
                                    <img
                                      src={personas[activePersona].image}
                                      alt={personas[activePersona].name[lang]}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="h-3 w-36 bg-paper/20 rounded animate-pulse" />
                                    <div className="h-2 w-24 bg-paper/10 rounded animate-pulse" />
                                  </div>
                                  <div className="ml-auto flex items-center gap-2 text-[0.65rem] text-paper/50 uppercase tracking-widest">
                                    <span className="inline-flex gap-1">
                                      <span className="w-1 h-1 rounded-full bg-paper/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                                      <span className="w-1 h-1 rounded-full bg-paper/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                                      <span className="w-1 h-1 rounded-full bg-paper/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </span>
                                    {lang === 'vi' ? "Đang soạn..." : "Writing..."}
                                  </div>
                                </div>
                                {/* Text skeleton lines */}
                                <div className="space-y-3">
                                  {[100, 92, 96, 88, 94, 70].map((w, i) => (
                                    <div
                                      key={i}
                                      className="h-3 bg-paper/15 rounded animate-pulse"
                                      style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }}
                                    />
                                  ))}
                                </div>
                              </motion.div>
                            ) : dialogues[`${selectedQuote.id}-${activePersona}-${lang}`] ? (
                              <motion.div
                                key="content"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="bg-deep-brown text-paper p-8 space-y-6"
                              >
                                <div className="flex items-center gap-3 pb-4 border-b border-paper/10">
                                  <div className="size-10 rounded-full overflow-hidden border border-paper/20">
                                    <img
                                      src={personas[activePersona].image}
                                      alt={personas[activePersona].name[lang]}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold uppercase tracking-widest">{personas[activePersona].name[lang]}</p>
                                    <p className="text-xs opacity-60">{personas[activePersona].voiceDesc[lang]}</p>
                                  </div>
                                </div>
                                <SmartTextRenderer
                                  content={dialogues[`${selectedQuote.id}-${activePersona}-${lang}`]}
                                  className="text-base leading-relaxed text-paper/95"
                                />
                              </motion.div>
                            ) : null}
                          </AnimatePresence>

                          {error && (
                            <div className="border border-vermilion/30 bg-vermilion/5 p-3 text-xs text-vermilion">
                              {error}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-4 pt-8 border-t border-vermilion/10">
                      <button
                        onClick={prevStep}
                        className="border border-vermilion text-vermilion px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-vermilion/5 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180 inline mr-2" />
                        {lang === 'vi' ? "Quay lại" : "Back"}
                      </button>
                    </div>

                  </div>{/* end max-w-3xl */}
                </div>{/* end right scrollable area */}
              </div>{/* end flex row */}

            </motion.section>
          )}

        </AnimatePresence>
      </main>

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} defaultQuotes={QUOTES} />}
    </div>
  );
}

