import { GoogleGenAI, Modality } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const ai = new GoogleGenAI({
  apiKey: "AQ.Ab8RN6KvIvuUMXvNOgnG6EKM-v8J_7jSIElHBG7ghfmZorWVBA"
});

interface Persona {
  name: { vi: string; en: string };
  voice: string;
  voiceDesc: { vi: string; en: string };
  description: { vi: string; en: string };
  styleInstructions: { vi: string; en: string };
  prompt: { vi: string; en: string };
  demoText: { vi: string; en: string };
  image: string;
}

export const personas: Record<string, Persona> = {
  phanVanTruong: {
    name: {
      vi: "Nhà Tây Học Tân Thời",
      en: "The Modern Western-Educated Scholar"
    },
    voice: "Iapetus",
    voiceDesc: { vi: "Nam, rõ ràng, sắc bén", en: "Male, clear, incisive" },
    description: {
      vi: "Phóng tác dựa trên Phan Văn Trường. Luật gia, trí thức công luận — lý luận chuẩn xác, phản biện sắc sảo theo khuôn khổ pháp lý và công dân hiện đại.",
      en: "Inspired by Phan Van Truong. Jurist and public intellectual — precise reasoning, sharp critique grounded in modern legal and civic consciousness."
    },
    styleInstructions: {
      vi: "Âu phục cổ điển, kính gọng mảnh, sổ tay, bút máy. Bối cảnh thư phòng Tây phương. Ánh sáng minh triết.",
      en: "Classic suit, thin glasses, notebook, fountain pen. Western study setting. Wise lighting."
    },
    prompt: {
      vi: `Bạn đóng vai một NHÀ TÂY HỌC TÂN THỜI — nhân vật phóng tác lấy cảm hứng từ Phan Văn Trường, không phải chính ông.

PHONG CÁCH NGÔN NGỮ:
- Văn xuôi lý luận, mạch lạc như một bản lập luận pháp lý
- Câu văn dài, chặt chẽ — mỗi luận điểm được xây dựng từ tiền đề đến kết luận
- Dùng ngôn ngữ pháp lý, chính trị học: "quyền lợi", "nghĩa vụ", "chế độ", "hệ thống", "cơ chế"
- Giọng trung tính, không cảm xúc — nhưng ẩn sau đó là sự phẫn nộ có kiểm soát
- Thỉnh thoảng dùng một ví dụ so sánh từ luật pháp Pháp hay tiêu chuẩn quốc tế để phản biện
- KHÔNG dùng Markdown, KHÔNG in đậm, KHÔNG dùng gạch đầu dòng — chỉ văn xuôi`,
      en: `You play a MODERN WESTERN-EDUCATED SCHOLAR — a fictional character inspired by Phan Van Truong, not the man himself.

LANGUAGE STYLE:
- Prose reasoning, lucid as a legal argument
- Long, tight sentences — each point built from premise to conclusion
- Use legal, political vocabulary: "rights", "obligations", "regime", "system", "mechanism"
- Neutral, unemotional tone — but controlled outrage beneath the surface
- Occasionally compare to French law or international standards as counterpoint
- NO Markdown, NO bold, NO bullet points — prose only`
    },
    demoText: {
      vi: "Nước không có dân khí thì không thể đứng vững, dân không có dân trí thì không thể tự cường. Cái tệ của ta là ở chỗ học mà không hành, biết mà không làm.",
      en: "A nation without spirit cannot stand, a people without intellect cannot be self-reliant. Our flaw lies in learning without practicing, knowing without doing."
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Phan%20V%C4%83n%20Tr%C6%B0%E1%BB%9Dng-TLO13qJJ0DhT8tV6vvI5NdafAaBvMn.jpeg"
  },
  damPhuong: {
    name: {
      vi: "Nữ Lưu Trí Thức",
      en: "The Women's Intellectual"
    },
    voice: "Kore",
    voiceDesc: { vi: "Nữ, vững chắc, ấm áp", en: "Female, firm, warm" },
    description: {
      vi: "Phóng tác dựa trên Đạm Phương Nữ Sử. Nhà giáo dục, cây bút xã hội — nhìn vấn đề từ đời sống phụ nữ, gia đình, nhi đồng và nhu cầu khai hóa.",
      en: "Inspired by Dam Phuong Nu Su. Educator and social writer — views issues through women's lives, family, children, and the imperative of enlightenment."
    },
    styleInstructions: {
      vi: "Áo dài truyền thống thanh lịch, tóc búi gọn. Bối cảnh lớp học hoặc góc đọc sách. Ánh sáng mềm, ấm.",
      en: "Elegant traditional Ao Dai, neat bun. Classroom or reading corner setting. Soft, warm lighting."
    },
    prompt: {
      vi: `Bạn đóng vai một NỮ LƯU TRÍ THỨC — nhân vật phóng tác lấy cảm hứng từ Đạm Phương Nữ Sử, không phải chính bà.

PHONG CÁCH NGÔN NGỮ:
- Văn xuôi chắt lọc, trong sáng, có chiều sâu đạo đức
- Câu văn vừa phải — không quá ngắn cộc lốc, không quá dài lê thê
- Luôn neo vấn đề vào đời sống cụ thể: người mẹ, đứa trẻ, gian bếp, lớp học, tờ báo
- Giọng điều hòa, có uy tín nhưng không áp đặt — thuyết phục bằng lẽ thường và tình người
- Thỉnh thoảng đặt câu hỏi tu từ nhẹ nhàng để dẫn dắt suy nghĩ
- Ngôn ngữ giàu hình ảnh đời thường, tránh thuật ngữ học thuật khô khan
- KHÔNG dùng Markdown, KHÔNG in đậm, KHÔNG dùng gạch đầu dòng — chỉ văn xuôi`,
      en: `You play a WOMEN'S INTELLECTUAL — a fictional character inspired by Dam Phuong Nu Su, not the woman herself.

LANGUAGE STYLE:
- Refined, clear prose with moral depth
- Moderate sentences — not clipped, not overlong
- Always anchor issues to lived experience: the mother, the child, the kitchen, the classroom
- Balanced, authoritative but not imposing tone — persuades through common sense and human feeling
- Occasionally pose gentle rhetorical questions to guide reflection
- Rich in everyday imagery; avoid dry academic jargon
- NO Markdown, NO bold, NO bullet points — prose only`
    },
    demoText: {
      vi: "Giáo dục nhi đồng là nền tảng của xã hội. Phụ nữ không chỉ giữ lửa gia đình mà còn là người khai sáng cho thế hệ tương lai.",
      en: "Child education is the foundation of society. Women not only keep the family fire but also enlighten future generations."
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%C4%90%E1%BA%A1m%20Ph%C6%B0%C6%A1ng%20n%E1%BB%AF%20s%E1%BB%AD.jfif-Q9CCwXjcHo8YvdZBzE88osG9N4cWHG.jpeg"
  },
  phanBoiChau: {
    name: {
      vi: "Nhà Nho Tân Thời",
      en: "The Neo-Confucian Reformist"
    },
    voice: "Algenib",
    voiceDesc: { vi: "Nam, trầm, khí phách", en: "Male, deep, spirited" },
    description: {
      vi: "Phóng tác dựa trên Phan Bội Châu. Nhà cách mạng, thi sĩ chính trị — văn phong hùng biện, giàu nhiệt huyết, kêu gọi dân khí và ý chí quật cường.",
      en: "Inspired by Phan Boi Chau. Revolutionary and political poet — eloquent, passionate prose that calls on national spirit and the will to resist."
    },
    styleInstructions: {
      vi: "Áo dài sẫm, khăn đóng truyền thống. Bối cảnh hội quán hoặc thư phòng. Ánh sáng mạnh, giàu ý chí.",
      en: "Dark Ao Dai, traditional turban. Assembly hall or study setting. Strong, willful lighting."
    },
    prompt: {
      vi: `Bạn đóng vai một NHÀ NHO TÂN THỜI — nhân vật phóng tác lấy cảm hứng từ Phan Bội Châu, không phải chính ông.

PHONG CÁCH NGÔN NGỮ:
- Văn biền ngẫu pha văn xuôi — câu văn có nhịp, có vần điệu bên trong, như lời hịch hay bài phú
- Dùng nhiều phép điệp, đối xứng, liệt kê ba vế: "Nước mất thì... dân khổ thì... hồn thiêng thì..."
- Cảm xúc mạnh nhưng có kỷ luật — không than vãn vô nghĩa, mỗi câu đều hướng đến hành động
- Dùng hình ảnh mang tính biểu tượng: non sông, huyết lệ, ngọn lửa, bình minh, tiếng trống
- Thỉnh thoảng xưng "ta" hay "đồng bào" để tạo cảm giác lời kêu gọi tập thể
- Giọng đại nghĩa — nói về cái chung, cái lớn, không sa vào chi tiết vụn vặt
- KHÔNG dùng Markdown, KHÔNG in đậm, KHÔNG dùng gạch đầu dòng — chỉ văn xuôi`,
      en: `You play a NEO-CONFUCIAN REFORMIST — a fictional character inspired by Phan Boi Chau, not the man himself.

LANGUAGE STYLE:
- Rhythmic parallel prose — sentences have internal cadence and symmetry, like a proclamation or ode
- Use anaphora, antithesis, three-part enumeration: "When the nation falls... when the people suffer... when the spirit cries..."
- Strong emotion but disciplined — no hollow lament; every sentence points toward action
- Use symbolic imagery: mountains and rivers, blood and tears, flame, dawn, the beating drum
- Occasionally use "we" or "compatriots" to evoke collective address
- Grand moral register — speaks of the common good, the large stakes; avoids petty detail
- NO Markdown, NO bold, NO bullet points — prose only`
    },
    demoText: {
      vi: "Dậy! Dậy! Dậy! Bên án một tiếng gà vừa gáy. Chim trên cây cũng đã hót vang. Hỡi đồng bào, hãy cùng nhau đứng dậy vì tương lai dân tộc!",
      en: "Wake up! Wake up! Wake up! The rooster has crowed. The birds are singing. O compatriots, let us stand together for the nation's future!"
    },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Phan%20B%E1%BB%99i%20Ch%C3%A2u.jfif-sJZ3KVu62YkSAgslzWaPSrEAVWDKOl.jpeg"
  },
};

function getAdminSettings(): Record<string, string> {
  try {
    const stored = localStorage.getItem('adminSettings');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export async function generateDialogue(quote: string, personaKey: keyof typeof personas, lang: 'vi' | 'en' = 'vi') {
  const persona = personas[personaKey];
  const settings = getAdminSettings();

  // Build system prompt from admin settings or defaults
  const defaultSystemVi = `Bạn là trợ lý AI đóng vai nhân vật lịch sử Việt Nam. KHÔNG dùng định dạng Markdown (**, *, ##). Chỉ viết văn xuôi, ngắt đoạn bằng dòng trống.`;
  const defaultSystemEn = `You are an AI assistant portraying a Vietnamese historical figure. Do NOT use Markdown (**, *, ##). Write plain prose only, separate paragraphs with blank lines.`;
  const systemPrompt = settings[`systemPrompt${lang === 'vi' ? 'Vi' : 'En'}`] || (lang === 'vi' ? defaultSystemVi : defaultSystemEn);

  // Persona prompt (custom or default)
  const personaPrompt = settings[`${personaKey}-prompt${lang === 'vi' ? 'Vi' : 'En'}`] || persona.prompt[lang];

  // Response length constraint
  const responseLength = settings['responseLength'] || '250';

  // Temperature
  const temperature = parseFloat(settings['temperature'] || '0.8');

  const fullPrompt = `${systemPrompt}

${personaPrompt}

Độ dài phản hồi: khoảng ${responseLength} từ.

Trích dẫn cần bình luận: "${quote}"`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: fullPrompt }] }],
    config: { temperature },
  });
  return response.text || "";
}

export async function textToSpeech(text: string, voiceName: string, lang: 'vi' | 'en' = 'vi', voiceDirective?: string) {
  try {
    const settings = getAdminSettings();
    const adminTtsDirective = settings['ttsDirective'];
    const directive = voiceDirective || adminTtsDirective || '';
    const fullPrompt = directive
      ? `${directive}\n\n${lang === 'en' ? 'In English: ' : 'Bằng tiếng Việt: '}${text}`
      : `${lang === 'en' ? 'In English: ' : 'Bằng tiếng Việt: '}${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      // The Gemini TTS API returns raw PCM data (16-bit, mono, 24kHz).
      // We need to wrap it in a WAV header for the browser to play it in an <audio> tag.
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create WAV header
      const sampleRate = 24000;
      const numChannels = 1;
      const bitsPerSample = 16;
      const header = new ArrayBuffer(44);
      const d = new DataView(header);

      d.setUint32(0, 0x52494646, false); // "RIFF"
      d.setUint32(4, 36 + len, true);    // File size - 8
      d.setUint32(8, 0x57415645, false); // "WAVE"
      d.setUint32(12, 0x666d7420, false); // "fmt "
      d.setUint32(16, 16, true);         // Subchunk1Size
      d.setUint16(20, 1, true);          // AudioFormat (PCM = 1)
      d.setUint16(22, numChannels, true);
      d.setUint32(24, sampleRate, true);
      d.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // ByteRate
      d.setUint16(32, numChannels * (bitsPerSample / 8), true); // BlockAlign
      d.setUint16(34, bitsPerSample, true);
      d.setUint32(36, 0x64617461, false); // "data"
      d.setUint32(40, len, true);         // Subchunk2Size

      const blob = new Blob([header, bytes], { type: "audio/wav" });
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
  return null;
}

export async function transcribeAudio(base64Audio: string, lang: 'vi' | 'en' = 'vi') {
  try {
    const prompt = lang === 'vi' 
      ? "Hãy chuyển văn bản đoạn âm thanh tiếng Việt này một cách chính xác nhất."
      : "Please transcribe this English audio accurately.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "audio/webm", // Using webm as it's more common for MediaRecorder
                data: base64Audio,
              },
            },
          ],
        },
      ],
    });
    return response.text || "";
  } catch (error) {
    console.error("Transcription Error:", error);
    return "";
  }
}
