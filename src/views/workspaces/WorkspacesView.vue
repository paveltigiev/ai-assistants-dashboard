<template>
  <div>
    <h1>workspaces</h1>
  </div>
</template>

<script setup>
async function createWorkspace(name) {
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("role")
    .single();

  if (userProfile.role !== "admin") {
    throw new Error("Только администратор может создавать воркспейсы!");
  }

  const { data, error } = await supabase.from("workspaces").insert([{ name }]);

  if (error) throw error;

  console.log("Воркспейс создан!");
}
</script>

<style lang="scss" scoped>

</style>