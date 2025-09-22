<script lang="ts">
  export let data;
  let project = { ...data.project };

  async function updateProject() {
    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });

    if (res.ok) {
      alert("✅ Project updated!");
    } else {
      alert("❌ Update failed");
    }
  }
</script>

<h1 class="text-2xl font-bold mb-4">✏️ Edit Project</h1>

<form on:submit|preventDefault={updateProject} class="space-y-3">
  <input bind:value={project.title} placeholder="Title" class="border p-2 w-full" />
  <input bind:value={project.org} placeholder="Organization" class="border p-2 w-full" />
  <input bind:value={project.role} placeholder="Role" class="border p-2 w-full" />
  <input bind:value={project.outcomes} placeholder="Outcomes" class="border p-2 w-full" />
  
  <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">
    Update
  </button>
</form>
