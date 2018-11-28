<template>
  <v-text-field color="demko" label="Wpisz lokalizacje" v-model="val" ref="autocomplete" prepend-icon="location_on"></v-text-field>
</template>

<script>
    export default {
        name: "autocomplete",
        props: {
          value: {
            type: String
          }
        },
        data(){
          return {
            val: this.value
          }
        },
        mounted(){
          this.$gmapApiPromiseLazy().then(() => {
            this.autocomplete = new google.maps.places.Autocomplete((this.$refs.autocomplete.$refs.input), {
              types: ['geocode'],
              componentRestrictions: {country: 'pl'}
            });
            this.$refs.autocomplete.$refs.input.placeholder = '';
            this.autocomplete.addListener('place_changed', () => {
              let place = this.autocomplete.getPlace();
              let ac = place.address_components;

              this.$emit('place_changed', {
                name: ac[0]["short_name"],
                lat: place.geometry.location.lat(),
                lng:  place.geometry.location.lng()
              });

              this.val = ac[0]["short_name"];
            });
          });

        },
    }
</script>

<style scoped>

</style>
