<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="card">
      <div class="card-header">
        <h2>お問い合わせ</h2>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <!-- 入力ステップ -->
      <form v-if="step === 'input'" @submit.prevent="toConfirm" class="form">
        <div class="field">
          <label class="field-label">お名前 <span class="required">*</span></label>
          <input v-model="form.name" type="text" required placeholder="山田 太郎" />
        </div>

        <div class="field">
          <label class="field-label">メールアドレス <span class="required">*</span></label>
          <input v-model="form.email" type="email" required placeholder="example@email.com" />
        </div>

        <div class="field">
          <label class="field-label">お問い合わせ種別 <span class="required">*</span></label>
          <select v-model="form.category" required>
            <option value="" disabled>選択してください</option>
            <option value="bug">バグ報告</option>
            <option value="feature">機能リクエスト</option>
            <option value="other">その他</option>
          </select>
        </div>

        <div class="field">
          <label class="field-label">お問い合わせ内容 <span class="required">*</span></label>
          <textarea
            v-model="form.message"
            required
            placeholder="お問い合わせ内容をご入力ください"
            rows="5"
          />
        </div>

        <p v-if="validationError" class="error-msg">{{ validationError }}</p>

        <button type="submit" class="btn-primary">確認する</button>
      </form>

      <!-- 確認ステップ -->
      <div v-else-if="step === 'confirm'" class="confirm">
        <p class="confirm-note">以下の内容で送信します。よろしければ「送信する」を押してください。</p>

        <div class="confirm-table">
          <div class="confirm-row">
            <span class="confirm-label">お名前</span>
            <span class="confirm-value">{{ form.name }}</span>
          </div>
          <div class="confirm-row">
            <span class="confirm-label">メール</span>
            <span class="confirm-value">{{ form.email }}</span>
          </div>
          <div class="confirm-row">
            <span class="confirm-label">種別</span>
            <span class="confirm-value">{{ categoryLabel }}</span>
          </div>
          <div class="confirm-row align-top">
            <span class="confirm-label">内容</span>
            <span class="confirm-value pre">{{ form.message }}</span>
          </div>
        </div>

        <p v-if="sendError" class="error-msg">{{ sendError }}</p>

        <div class="btn-group">
          <button class="btn-secondary" @click="step = 'input'" :disabled="sending">戻る</button>
          <button class="btn-primary" @click="send" :disabled="sending">
            <span v-if="sending">送信中…</span>
            <span v-else>送信する</span>
          </button>
        </div>
      </div>

      <!-- 完了ステップ -->
      <div v-else-if="step === 'done'" class="submitted-msg">
        <div class="submitted-icon">✓</div>
        <p>お問い合わせを受け付けました。</p>
        <p class="sub">内容を確認のうえ、ご登録のメールアドレス宛にご回答いたします。</p>
        <button class="btn-primary" @click="emit('close')">閉じる</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE  = 'valorantToolsSuport'
const EMAILJS_TEMPLATE = 'template_droxhiq'
const EMAILJS_KEY      = '19eKLO4vnSkZSZ3eT'

const emit = defineEmits<{
  (e: 'close'): void
}>()

type Step = 'input' | 'confirm' | 'done'

const step = ref<Step>('input')
const sending = ref(false)
const sendError = ref('')
const validationError = ref('')

const form = reactive({
  name: '',
  email: '',
  category: '',
  message: '',
})

const categoryMap: Record<string, string> = {
  bug:     'バグ報告',
  feature: '機能リクエスト',
  other:   'その他',
}

const categoryLabel = computed(() => categoryMap[form.category] ?? form.category)

function validate(): boolean {
  if (!form.name.trim())    { validationError.value = 'お名前を入力してください。'; return false }
  if (!form.email.trim())   { validationError.value = 'メールアドレスを入力してください。'; return false }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    validationError.value = '有効なメールアドレスを入力してください。'
    return false
  }
  if (!form.category)       { validationError.value = 'お問い合わせ種別を選択してください。'; return false }
  if (!form.message.trim()) { validationError.value = 'お問い合わせ内容を入力してください。'; return false }
  validationError.value = ''
  return true
}

function toConfirm(): void {
  if (!validate()) return
  step.value = 'confirm'
  sendError.value = ''
}

async function send(): Promise<void> {
  sending.value = true
  sendError.value = ''
  try {
    await emailjs.send(
      EMAILJS_SERVICE,
      EMAILJS_TEMPLATE,
      {
        from_name:  form.name,
        from_email: form.email,
        category:   categoryLabel.value,
        message:    form.message,
      },
      EMAILJS_KEY,
    )
    step.value = 'done'
  } catch (err: unknown) {
    const e = err as { text?: string } | null
    sendError.value = `送信に失敗しました（${e?.text ?? err}）。時間をおいて再度お試しください。`
  } finally {
    sending.value = false
  }
}

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
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 4px 4px 0 rgba(255,255,255,0.03), 0 8px 32px rgba(0, 0, 0, 0.5);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
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
}

.close-btn:hover {
  color: var(--text-primary);
  background: var(--toolbar-btn-hover);
}

/* フォーム */
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.required {
  color: var(--accent);
  margin-left: 2px;
}

.field input,
.field select,
.field textarea {
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: 0;
  font-size: 13px;
  font-family: var(--font-family);
  outline: none;
  background: var(--start-input-bg);
  color: var(--text-primary);
  transition: border-color 0.12s, box-shadow 0.12s;
  width: 100%;
  box-sizing: border-box;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: var(--text-primary);
  box-shadow: inset 0 0 0 1px var(--text-primary);
}

.field textarea {
  resize: vertical;
  min-height: 100px;
}

/* 確認画面 */
.confirm {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.confirm-note {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.confirm-table {
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

.confirm-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}

.confirm-row:last-child {
  border-bottom: none;
}

.confirm-row.align-top {
  align-items: flex-start;
}

.confirm-label {
  width: 72px;
  flex-shrink: 0;
  padding: 10px 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
  border-right: 1px solid var(--border);
}

.confirm-value {
  padding: 10px 12px;
  color: var(--text-primary);
  font-size: 13px;
  line-height: 1.5;
  word-break: break-all;
}

.confirm-value.pre {
  white-space: pre-wrap;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  border-radius: 0;
  font-size: 13px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: opacity 0.12s;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.btn-primary {
  background: var(--text-primary);
  color: var(--bg);
  border: 1px solid var(--text-primary);
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.82;
}

.btn-primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--border-active);
  color: var(--text-primary);
}

.btn-secondary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* 単独の送信ボタン（入力ステップ） */
.form > .btn-primary {
  width: 100%;
  margin-top: 4px;
}

/* エラー */
.error-msg {
  font-size: 12px;
  color: #e05555;
  line-height: 1.5;
}

/* 送信完了 */
.submitted-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 0 8px;
  text-align: center;
}

.submitted-icon {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-active);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.submitted-msg p {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
}

.submitted-msg .sub {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: -4px;
}

.submitted-msg .btn-primary {
  margin-top: 12px;
  max-width: 160px;
  width: 160px;
}
</style>
