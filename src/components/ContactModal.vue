<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="card">
      <div class="card-header">
        <h2>お問い合わせ</h2>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <div v-if="submitted" class="submitted-msg">
        <div class="submitted-icon">✓</div>
        <p>お問い合わせを受け付けました。</p>
        <p class="sub">内容を確認のうえ、ご登録のメールアドレス宛にご回答いたします。</p>
        <button class="btn-primary" @click="emit('close')">閉じる</button>
      </div>

      <form v-else @submit.prevent="submit" class="form">
        <div class="field">
          <label class="field-label">お名前 <span class="required">*</span></label>
          <input v-model="form.name" type="text" required placeholder="山田 太郎" />
        </div>

        <div class="field">
          <label class="field-label">メールアドレス <span class="required">*</span></label>
          <input v-model="form.email" type="email" required placeholder="example@email.com" />
        </div>

        <div class="field">
          <label class="field-label">お問い合わせ種別</label>
          <select v-model="form.category">
            <option value="general">一般的なご質問</option>
            <option value="bug">不具合・バグ報告</option>
            <option value="feature">機能のご要望</option>
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

        <button type="submit" class="btn-primary">送信する</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const submitted = ref(false)

const form = reactive({
  name: '',
  email: '',
  category: 'general',
  message: '',
})

function submit(): void {
  // TODO: バックエンドAPIエンドポイントに接続する
  submitted.value = true
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

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  background: var(--text-primary);
  color: var(--bg);
  border: 1px solid var(--text-primary);
  border-radius: 0;
  font-size: 13px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: opacity 0.12s;
  width: 100%;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin-top: 4px;
}

.btn-primary:hover {
  opacity: 0.82;
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
}
</style>
