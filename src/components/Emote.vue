<template>
    <img :src="img" alt="emote" width="30" height="30" />
</template>

<script>
export default {
    props:{
        img: {
            type: String,
            default: ''
        }
    }
}
</script>