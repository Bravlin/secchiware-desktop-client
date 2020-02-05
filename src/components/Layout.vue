<template>
    <div id="layout" class="d-flex">
        <div id="navbar" class="d-flex flex-column">
            <div>Placeh</div>
            <div>Placeh</div>
            <div class="mt-auto">Placeh</div>
        </div>
        <b-container id="main-content" fluid></b-container>
    </div>
</template>

<script>
export default {
    name: 'layout'
}
</script>

<style scoped>
#layout {
  height: 100vh;
}

#navbar {
    width: 100px;
}

#main-content {
    background-color: #424242;
}
</style>