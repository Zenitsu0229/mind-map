<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="card">
      <div class="card-header">
        <h2>{{ title }}</h2>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <div class="legal-meta">
        <span>最終更新日：{{ lastUpdated }}</span>
      </div>

      <div class="legal-body">
        <template v-for="(section, i) in sections" :key="i">
          <h3>{{ section.heading }}</h3>
          <p v-for="(para, j) in section.paragraphs" :key="j" v-html="para"></p>
          <ul v-if="section.items">
            <li v-for="(item, k) in section.items" :key="k">{{ item }}</li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

type LegalType = 'terms' | 'privacy' | 'cookie'

interface Section {
  heading: string
  paragraphs?: string[]
  items?: string[]
}

const props = defineProps<{
  type: LegalType
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const lastUpdated = '2026年3月17日'

const title = computed(() => {
  if (props.type === 'terms') return '利用規約'
  if (props.type === 'privacy') return 'プライバシーポリシー'
  return 'Cookieポリシー'
})

const sections = computed<Section[]>(() => {
  if (props.type === 'terms') return termsSections
  if (props.type === 'privacy') return privacySections
  return cookieSections
})

const termsSections: Section[] = [
  {
    heading: '第1条（適用）',
    paragraphs: [
      'この利用規約（以下「本規約」）は、Mind Map（以下「当サービス」）の利用条件を定めるものです。ユーザーの皆さまには、本規約に同意いただいたうえで、当サービスをご利用いただきます。',
    ],
  },
  {
    heading: '第2条（利用登録）',
    paragraphs: [
      '当サービスは、登録不要でご利用いただけます。一部機能の利用にあたっては、所定の方法により利用登録を行っていただく場合があります。',
    ],
  },
  {
    heading: '第3条（禁止事項）',
    paragraphs: ['ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。'],
    items: [
      '法令または公序良俗に違反する行為',
      '犯罪行為に関連する行為',
      '当サービスのサーバーまたはネットワークの機能を破壊または妨害する行為',
      '当サービスの運営を妨害するおそれのある行為',
      '他のユーザーに関する個人情報等を収集または蓄積する行為',
      '不正アクセスをし、またはこれを試みる行為',
      '他のユーザーに成りすます行為',
      '当サービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為',
      'その他、運営者が不適切と判断する行為',
    ],
  },
  {
    heading: '第4条（当サービスの提供の停止等）',
    paragraphs: [
      '運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく当サービスの全部または一部の提供を停止または中断することができるものとします。',
    ],
    items: [
      '当サービスにかかるコンピュータシステムの保守点検または更新を行う場合',
      '地震、落雷、火災、停電または天災などの不可抗力により、当サービスの提供が困難となった場合',
      'コンピュータまたは通信回線等が事故により停止した場合',
      'その他、運営者が当サービスの提供が困難と判断した場合',
    ],
  },
  {
    heading: '第5条（免責事項）',
    paragraphs: [
      '運営者は、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを明示的にも黙示的にも保証しておりません。',
      '運営者は、当サービスによってユーザーに生じたあらゆる損害について、一切の責任を負いません。',
    ],
  },
  {
    heading: '第6条（サービス内容の変更等）',
    paragraphs: [
      '運営者は、ユーザーに通知することなく、当サービスの内容を変更しまたは当サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。',
    ],
  },
  {
    heading: '第7条（利用規約の変更）',
    paragraphs: [
      '運営者は必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。変更後の利用規約は、当サービス上に掲示された時点から効力を生じるものとします。',
    ],
  },
  {
    heading: '第8条（準拠法・裁判管轄）',
    paragraphs: [
      '本規約の解釈にあたっては、日本法を準拠法とします。当サービスに関して紛争が生じた場合には、運営者の本店所在地を管轄する裁判所を専属的合意管轄とします。',
    ],
  },
]

const privacySections: Section[] = [
  {
    heading: '1. 基本方針',
    paragraphs: [
      'Mind Map（以下「当サービス」）は、ユーザーの個人情報の保護を重要な責務と考え、個人情報の保護に関する法律（個人情報保護法）その他の関連法令を遵守します。',
    ],
  },
  {
    heading: '2. 取得する情報',
    paragraphs: ['当サービスでは、以下の情報を取得する場合があります。'],
    items: [
      'お問い合わせフォームにご入力いただいた氏名・メールアドレス・お問い合わせ内容',
      'アクセスログ（IPアドレス、ブラウザの種類、参照元URL等）',
      'Cookieおよびこれに類する技術を通じて取得される情報',
    ],
  },
  {
    heading: '3. 利用目的',
    paragraphs: ['取得した情報は、以下の目的で利用します。'],
    items: [
      'お問い合わせへの対応',
      '当サービスの改善・新機能の開発',
      '不正利用の防止および調査',
      '利用状況の分析（統計的な形式に加工したうえで利用します）',
    ],
  },
  {
    heading: '4. 第三者への提供',
    paragraphs: [
      '当サービスは、以下の場合を除き、取得した個人情報を第三者に提供しません。',
    ],
    items: [
      'ユーザーの同意がある場合',
      '法令に基づく場合',
      '人の生命・身体・財産の保護のために必要な場合',
    ],
  },
  {
    heading: '5. Cookieの利用',
    paragraphs: [
      '当サービスでは、利便性の向上および利用状況の分析を目的として、Cookieを使用しています。詳細はCookieポリシーをご参照ください。',
    ],
  },
  {
    heading: '6. 安全管理措置',
    paragraphs: [
      '当サービスは、取得した情報の漏洩・滅失・毀損を防止するため、適切な安全管理措置を講じます。',
    ],
  },
  {
    heading: '7. 開示・訂正・削除',
    paragraphs: [
      'ユーザーご自身の個人情報について、開示・訂正・削除等をご希望の場合は、お問い合わせフォームよりご連絡ください。ご本人確認のうえ、速やかに対応いたします。',
    ],
  },
  {
    heading: '8. プライバシーポリシーの変更',
    paragraphs: [
      '当サービスは、必要に応じて本ポリシーを変更することがあります。変更後のポリシーは、当サービス上に掲示した時点から効力を生じるものとします。',
    ],
  },
  {
    heading: '9. お問い合わせ',
    paragraphs: [
      '本ポリシーに関するお問い合わせは、当サービスのお問い合わせフォームよりご連絡ください。',
    ],
  },
]

const cookieSections: Section[] = [
  {
    heading: '1. Cookieとは',
    paragraphs: [
      'Cookieとは、ウェブサイトがお使いのブラウザに保存する小さなテキストファイルです。ウェブサイトを再訪問した際に、以前の設定や状態を記憶するために使用されます。',
    ],
  },
  {
    heading: '2. 当サービスで使用するCookieの種類',
    paragraphs: ['当サービスでは、以下の種類のCookieを使用しています。'],
    items: [
      '必須Cookie：当サービスの基本機能（テーマ設定の保存など）に必要なCookieです。これらはサービスの運営に不可欠であり、無効化することはできません。',
      '機能Cookie：ユーザーの設定や入力内容（マインドマップデータ等）をブラウザのローカルストレージに保存するために使用します。',
      '分析Cookie：当サービスの利用状況を把握し、サービス改善に役立てるために使用します。収集されるデータは統計的に処理され、個人を特定するものではありません。',
    ],
  },
  {
    heading: '3. ローカルストレージの利用',
    paragraphs: [
      '当サービスでは、マインドマップデータの保存にブラウザのローカルストレージを使用しています。ローカルストレージのデータはサーバーには送信されず、お使いのデバイスのみに保存されます。',
    ],
  },
  {
    heading: '4. サードパーティCookie',
    paragraphs: [
      '当サービスでは、Google Analytics等のサードパーティサービスを利用する場合があり、これらのサービスが独自のCookieを設定することがあります。各サードパーティのプライバシーポリシーをご確認ください。',
    ],
  },
  {
    heading: '5. Cookieの管理・無効化',
    paragraphs: [
      'ブラウザの設定からCookieを無効化することができます。ただし、Cookieを無効化した場合、当サービスの一部機能が正常に動作しない場合があります。',
      '主要ブラウザでのCookie設定方法については、各ブラウザのヘルプページをご参照ください。',
    ],
  },
  {
    heading: '6. Cookieポリシーの変更',
    paragraphs: [
      '当サービスは、必要に応じて本ポリシーを変更することがあります。重要な変更がある場合には、当サービス上でお知らせします。',
    ],
  },
  {
    heading: '7. お問い合わせ',
    paragraphs: [
      'Cookieの使用に関するご質問は、当サービスのお問い合わせフォームよりご連絡ください。',
    ],
  },
]

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => { window.addEventListener('keydown', onKeydown) })
onUnmounted(() => { window.removeEventListener('keydown', onKeydown) })
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(6px);
}

.card {
  background: var(--overlay-card-bg);
  color: var(--overlay-card-text);
  border: 1px solid var(--border);
  border-radius: 0;
  padding: 28px 32px;
  width: 100%;
  max-width: 640px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 4px 4px 0 rgba(255,255,255,0.03), 0 8px 32px rgba(0, 0, 0, 0.5);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-header h2 {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: 1px solid transparent;
  font-size: 1rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.12s, background 0.12s;
  padding: 4px 8px;
  border-radius: 0;
  flex-shrink: 0;
}

.close-btn:hover {
  color: var(--text-primary);
  background: var(--toolbar-btn-hover);
}

.legal-meta {
  font-size: 10px;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.legal-body {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.legal-body h3 {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--text-primary);
  margin-top: 22px;
  margin-bottom: 8px;
}

.legal-body h3:first-child {
  margin-top: 0;
}

.legal-body p {
  font-size: 0.82rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.legal-body ul {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legal-body ul li {
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--text-secondary);
  padding-left: 14px;
  position: relative;
}

.legal-body ul li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--accent);
  opacity: 0.7;
}
</style>
