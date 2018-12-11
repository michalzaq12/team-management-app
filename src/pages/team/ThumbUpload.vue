<template>
      <file-upload :class="{'white--text v-btn upload-button v-btn--round demko': !raw}"
                   :post-action="postAction"
                   :put-action="putAction"
                   :extensions="extensions"
                   :accept="accept"
                   :size="size || 0"
                   :drop="false"
                   :drop-directory="false"
                   :add-index="false"
                    v-model="files"
                   @input-filter="inputFilter"
                   @input-file="inputFile"
                   ref="upload">
        <slot/>
      </file-upload>
</template>

<style lang="scss" scoped>
  .upload-container {
    max-height: 200px;
  }

  .upload-button {
    cursor: pointer;
    display: inline-flex;
  }

  .thumb {
    margin-top: 30px;
  }
</style>


<script>
  import ImageCompressor from '@xkeshi/image-compressor'
  import FileUpload from 'vue-upload-component'
  export default {
    components: {
      FileUpload,
    },
    props:{
      raw: {
        type: Boolean,
        default: false
      },
      icon:{
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        files: [],
        accept: 'image/png,image/jpeg',
        extensions: 'jpg,jpeg,png',
        size: 1024 * 1024 * 2,
        postAction: '/upload/post',
        putAction: '/upload/put',
        uploadAuto: false,
        isOption: false,
      }
    },
    methods: {
      inputFilter(newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
          this.$refs.upload.clear();
          // Filter system files or hide files
          if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
            return prevent()
          }
          // Filter php html js file
          if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
            return prevent()
          }
        }
        if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
          // Create a blob field
          newFile.blob = '';
          let URL = window.URL || window.webkitURL;
          if (URL && URL.createObjectURL) {
            newFile.blob = URL.createObjectURL(newFile.file)
          }
          // Thumbnails
          newFile.thumb = ''
          if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
            newFile.thumb = newFile.blob
          }
        }
      },
      inputFile(newFile, oldFile) {
        if (newFile && oldFile) {
          if (newFile.active && !oldFile.active) {
            if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
              this.$refs.upload.update(newFile, {
                error: 'size'
              })
            }
          }
        }
        if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
          this.$emit('file-selected');
          if (this.uploadAuto && !this.$refs.upload.active) {
            this.$refs.upload.active = true
          }
        }
      },
      reset() {
        this.files = [];
      },
      send(url, method = 'post') {
        if (this.files.length === 0) return Promise.resolve();
        const formData = new FormData();
        formData.append('file', this.files[0].file);
        return this.$http[method](url, formData, {
          timeout: 5000
        })
      }
    }
  }
</script>
