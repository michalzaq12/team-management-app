<template>
      <file-upload :class="{'white--text v-btn upload-button v-btn--round demko': !raw}" :post-action="postAction" :put-action="putAction" :extensions="extensions" :accept="accept" :size="size || 0" :headers="headers" :drop="drop" :drop-directory="dropDirectory" :add-index="addIndex"
        v-model="files" @input-filter="inputFilter" @input-file="inputFile" ref="upload">
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
        minSize: 1024,
        size: 1024 * 1024 * 10,
        drop: true,
        dropDirectory: true,
        addIndex: false,
        name: 'file',
        postAction: '/upload/post',
        putAction: '/upload/put',
        headers: {
          'X-Csrf-Token': 'xxxx',
        },
        autoCompress: 1024 * 1024,
        uploadAuto: false,
        isOption: false,
      }
    },
    methods: {
      inputFilter(newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
          this.$refs.upload.clear();
          // Before adding a file
          // 添加文件前
          // Filter system files or hide files
          // 过滤系统文件 和隐藏文件
          if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
            return prevent()
          }
          // Filter php html js file
          // 过滤 php html js 文件
          if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
            return prevent()
          }
          // Automatic compression
          // 自动压缩
          if (newFile.file && newFile.type.substr(0, 6) === 'image/' && this.autoCompress > 0 && this.autoCompress < newFile.size) {
            newFile.error = 'compressing'
            const imageCompressor = new ImageCompressor(null, {
              convertSize: Infinity,
              maxWidth: 512,
              maxHeight: 512,
            })
            imageCompressor.compress(newFile.file)
              .then((file) => {
                this.$refs.upload.update(newFile, {
                  error: '',
                  file,
                  size: file.size,
                  type: file.type
                })
              })
              .catch((err) => {
                this.$refs.upload.update(newFile, {
                  error: err.message || 'compress'
                })
              })
          }
        }
        if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
          // Create a blob field
          // 创建 blob 字段
          newFile.blob = ''
          let URL = window.URL || window.webkitURL
          if (URL && URL.createObjectURL) {
            newFile.blob = URL.createObjectURL(newFile.file)
          }
          // Thumbnails
          // 缩略图
          newFile.thumb = ''
          if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
            newFile.thumb = newFile.blob
          }
        }
      },
      // add, update, remove File Event
      inputFile(newFile, oldFile) {
        if (newFile && oldFile) {
          // update
          if (newFile.active && !oldFile.active) {
            // beforeSend
            // min size
            if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
              this.$refs.upload.update(newFile, {
                error: 'size'
              })
            }
          }
          if (newFile.progress !== oldFile.progress) {
            // progress
          }
          if (newFile.error && !oldFile.error) {
            // error
          }
          if (newFile.success && !oldFile.success) {
            // success
          }
        }
        if (!newFile && oldFile) {
          // remove
          if (oldFile.success && oldFile.response.id) {
            // $.ajax({
            //   type: 'DELETE',
            //   url: '/upload/delete?id=' + oldFile.response.id,
            // })
          }
        }
        // Automatically activate upload
        if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
          this.$emit('file-selected');
          if (this.uploadAuto && !this.$refs.upload.active) {
            this.$refs.upload.active = true
          }
        }
      },
      alert(message) {
        alert(message)
      },
      reset() {
        this.files = [];
      },
      send(url, method = 'post') {
        if (this.files.length === 0) return Promise.resolve();
        console.log(this.files[0]);
        const formData = new FormData();
        formData.append('file', this.files[0].file);
        return this.$http[method](url, formData, {
          timeout: 5000
        })
      }
    }
  }
</script>
