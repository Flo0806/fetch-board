<script setup lang="ts">
export interface SecondaryField {
  value: string
  label: string
  isPath?: boolean
}

export interface InfoCardData {
  icon: string
  valuePath: string
  label: string
  labelIsPath: boolean
  description: string
  field1Value: string
  field1Label: string
  field1IsPath: boolean
  field2Value: string
  field2Label: string
  field2IsPath: boolean
}

const props = defineProps<{
  icon?: string
  value: string | number
  label: string
  description?: string
  fields?: SecondaryField[]
  dashboardEditMode?: boolean
}>()

const emit = defineEmits<{
  'delete': []
  'save': [data: InfoCardData]
  'edit-mode': [isEditing: boolean]
}>()

// Card edit mode
const isCardEdit = ref(false)

// Local edit state
const editIcon = ref(props.icon || 'i-heroicons-chart-bar')
const editValuePath = ref(String(props.value))
const editLabel = ref(props.label)
const editLabelIsPath = ref(false)
const editDescription = ref(props.description || '')

// Secondary fields (2)
const editField1Value = ref(props.fields?.[0]?.value || '')
const editField1Label = ref(props.fields?.[0]?.label || '')
const editField1IsPath = ref(props.fields?.[0]?.isPath || false)
const editField2Value = ref(props.fields?.[1]?.value || '')
const editField2Label = ref(props.fields?.[1]?.label || '')
const editField2IsPath = ref(props.fields?.[1]?.isPath || false)

// Track changes
const isDirty = computed(() => {
  return editIcon.value !== (props.icon || 'i-heroicons-chart-bar')
    || editValuePath.value !== String(props.value)
    || editLabel.value !== props.label
    || editDescription.value !== (props.description || '')
    || editField1Value.value !== (props.fields?.[0]?.value || '')
    || editField2Value.value !== (props.fields?.[1]?.value || '')
})

function startEdit() {
  editIcon.value = props.icon || 'i-heroicons-chart-bar'
  editValuePath.value = String(props.value)
  editLabel.value = props.label
  editDescription.value = props.description || ''
  editField1Value.value = props.fields?.[0]?.value || ''
  editField1Label.value = props.fields?.[0]?.label || ''
  editField1IsPath.value = props.fields?.[0]?.isPath || false
  editField2Value.value = props.fields?.[1]?.value || ''
  editField2Label.value = props.fields?.[1]?.label || ''
  editField2IsPath.value = props.fields?.[1]?.isPath || false
  isCardEdit.value = true
  emit('edit-mode', true)
}

function cancelEdit() {
  isCardEdit.value = false
  emit('edit-mode', false)
}

function saveEdit() {
  emit('save', {
    icon: editIcon.value,
    valuePath: editValuePath.value,
    label: editLabel.value,
    labelIsPath: editLabelIsPath.value,
    description: editDescription.value,
    field1Value: editField1Value.value,
    field1Label: editField1Label.value,
    field1IsPath: editField1IsPath.value,
    field2Value: editField2Value.value,
    field2Label: editField2Label.value,
    field2IsPath: editField2IsPath.value,
  })
  isCardEdit.value = false
  emit('edit-mode', false)
}
</script>

<template>
  <UCard class="relative h-full">
    <!-- Dashboard Mode: Edit/Delete -->
    <div
      v-if="dashboardEditMode && !isCardEdit"
      class="absolute top-2 right-2 flex gap-1 z-10"
    >
      <UButton
        size="xs"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-pencil"
        @click="startEdit"
      />
      <UButton
        size="xs"
        variant="ghost"
        color="error"
        icon="i-heroicons-trash"
        @click="emit('delete')"
      />
    </div>

    <!-- Card Edit Mode: Save/Cancel -->
    <div
      v-if="isCardEdit"
      class="absolute top-2 right-2 flex gap-1 z-10"
    >
      <UButton
        size="xs"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-x-mark"
        @click="cancelEdit"
      />
      <UButton
        size="xs"
        variant="solid"
        icon="i-heroicons-check"
        :disabled="!isDirty"
        @click="saveEdit"
      />
    </div>

    <div class="flex items-center gap-4">
      <!-- Icon -->
      <div class="shrink-0 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
        <UIcon
          :name="isCardEdit ? editIcon : (icon || 'i-heroicons-chart-bar')"
          class="size-8 text-primary-500"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- View Mode -->
        <template v-if="!isCardEdit">
          <div class="text-3xl font-bold tracking-tight">
            {{ value }}
          </div>
          <div class="text-sm text-muted truncate">
            {{ label }}
          </div>
          <div
            v-if="description"
            class="text-xs text-muted/70 truncate mt-0.5"
          >
            {{ description }}
          </div>
        </template>

        <!-- Edit Mode -->
        <div
          v-else
          class="space-y-2"
        >
          <!-- Value (always path) -->
          <div class="flex items-center gap-2">
            <div class="w-4 shrink-0" />
            <UInput
              v-model="editValuePath"
              placeholder="response.stargazers_count"
              class="flex-1"
            />
            <span class="text-xs text-muted shrink-0 w-10">Wert</span>
          </div>

          <!-- Label -->
          <div class="flex items-center gap-2">
            <UTooltip text="Wert aus Response holen">
              <UCheckbox
                v-model="editLabelIsPath"
                class="shrink-0"
              />
            </UTooltip>
            <UInput
              v-model="editLabel"
              :placeholder="editLabelIsPath ? 'response.name' : 'Label'"
              class="flex-1"
            />
            <span class="text-xs text-muted shrink-0 w-10">Label</span>
          </div>

          <!-- Description (no path option) -->
          <div class="flex items-center gap-2">
            <div class="w-4 shrink-0" />
            <UInput
              v-model="editDescription"
              placeholder="Beschreibung (optional)"
              class="flex-1"
            />
            <span class="text-xs text-muted shrink-0 w-10">Info</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Fields -->
    <div
      v-if="(fields && fields.length > 0 && !isCardEdit) || isCardEdit"
      class="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800"
    >
      <!-- View Mode -->
      <div
        v-if="!isCardEdit && fields && fields.length > 0"
        class="grid gap-4"
        :class="{
          'grid-cols-1': fields.length === 1,
          'grid-cols-2': fields.length >= 2,
        }"
      >
        <div
          v-for="(field, index) in fields.slice(0, 2)"
          :key="index"
          class="text-center"
        >
          <div class="text-lg font-semibold">
            {{ field.value }}
          </div>
          <div class="text-xs text-muted truncate">
            {{ field.label }}
          </div>
        </div>
      </div>

      <!-- Edit Mode: 2 optional fields -->
      <div
        v-if="isCardEdit"
        class="space-y-2"
      >
        <div class="text-xs text-muted mb-2">
          Zusätzliche Felder (optional)
        </div>

        <!-- Field 1 -->
        <div class="flex items-center gap-2">
          <UTooltip text="Wert aus Response holen">
            <UCheckbox
              v-model="editField1IsPath"
              class="shrink-0"
            />
          </UTooltip>
          <UInput
            v-model="editField1Value"
            :placeholder="editField1IsPath ? 'response.downloads' : '42'"
            size="sm"
            class="flex-1"
          />
          <UInput
            v-model="editField1Label"
            placeholder="Label"
            size="sm"
            class="w-24"
          />
        </div>

        <!-- Field 2 -->
        <div class="flex items-center gap-2">
          <UTooltip text="Wert aus Response holen">
            <UCheckbox
              v-model="editField2IsPath"
              class="shrink-0"
            />
          </UTooltip>
          <UInput
            v-model="editField2Value"
            :placeholder="editField2IsPath ? 'response.stars' : '100'"
            size="sm"
            class="flex-1"
          />
          <UInput
            v-model="editField2Label"
            placeholder="Label"
            size="sm"
            class="w-24"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
