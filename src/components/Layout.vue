<template>
    <div id="layout" class="d-flex">
        <div id="navbar" class="d-flex flex-column">
            <div class="py-1 navbar-button"><b-icon-cloud-fill class="navbar-icon"></b-icon-cloud-fill></div>
            <div class="py-1 navbar-button"><b-icon-laptop class="navbar-icon"></b-icon-laptop></div>
            <div class="py-1 navbar-button"><b-icon-documents class="navbar-icon"></b-icon-documents></div>
            <div class="py-1 navbar-button mt-auto"><b-icon-gear-fill class="navbar-icon"></b-icon-gear-fill></div>
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

#navbar, .navbar-button {
    width: 70px;
}

#navbar .navbar-button:hover {
    color:gray;
    cursor: -webkit-grabbing;
}

#navbar .navbar-icon {
    width: 50px;
    height: 50px;
    margin-left: auto;
    margin-right: auto;
}

#main-content {
    background-color: #424242;
}
</style>