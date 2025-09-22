<script lang="ts">

  import { onMount } from "svelte";
  import * as mammoth from "mammoth";

  onMount(async () => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = (await import("pdfjs-dist/build/pdf.worker?url")).default;
  });

  export let data;
  let projects = data.projects;

  let title = "";
  let org = "";
  let role = "";
  let outcomes = "";
  let techStack = "";

  let fileText = ""; // hasil bacaan file (pdf/docx)

  // ========== CRUD Project Manual ==========
  async function addProject() {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        userId: 1,
        title,
        org,
        role,
        outcomes,
        techStack: { backend: "Node.js", db: "MySQL" }
      })
    });

    if (res.ok) {
      projects = [
        ...projects,
        {
          id: crypto.randomUUID(),
          userId: 1,
          title,
          org,
          role,
          startAt: null,
          endAt: null,
          outcomes,
          techStack: { backend: "Node.js", db: "MySQL" }
        }
      ];
      title = org = role = outcomes = techStack = "";
      alert("✅ Project created");
    }
  }

  async function deleteProject(id: string) {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      projects = projects.filter((p) => p.id !== id);
      alert("❌ Project deleted");
    }
  }

  // ========== Upload File (PDF / DOCX) ==========
  async function handleFileUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      // --- PDF ---
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        let text = "";
        const typedarray = new Uint8Array(this.result as ArrayBuffer);
        const pdfjsLib = await import("pdfjs-dist");
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(" ") + "\n";
        }

        fileText = text; // ✅ set setelah parsing selesai
        await saveFileToBackend(file.name, text, "PDF Upload");
      };
      fileReader.readAsArrayBuffer(file);

    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // --- DOCX ---
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      fileText = text; // ✅ langsung set hasil parsing
      await saveFileToBackend(file.name, text, "DOCX Upload");

    } else {
      alert("❌ Unsupported file type. Please upload PDF or DOCX.");
      return;
    }
  }

  // Simpan hasil parsing ke backend
  async function saveFileToBackend(filename: string, content: string, org: string) {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        userId: 1,
        title: filename,
        org,
        role: "Document",
        outcomes: content,
        techStack: { parser: "client-side" }
      })
    });

    if (res.ok) {
      projects = await res.json();
      alert("📄 File content saved to backend");
    }
  }
</script>

<h1 class="text-2xl font-bold mb-4">📂 Projects</h1>

<!-- Form tambah project -->
<form on:submit|preventDefault={addProject} class="space-y-2 mb-6">
  <input bind:value={title} placeholder="Title" class="border p-2 w-full" />
  <input bind:value={org} placeholder="Organization" class="border p-2 w-full" />
  <input bind:value={role} placeholder="Role" class="border p-2 w-full" />
  <input bind:value={outcomes} placeholder="Outcomes" class="border p-2 w-full" />
  <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
    Add Project
  </button>
</form>

<!-- Upload File (PDF/DOCX) -->
<div class="mb-6">
  <input
    type="file"
    accept=".pdf,.docx"
    on:change={handleFileUpload}
    class="mb-2"
  />
  {#if fileText}
    <h2 class="text-lg font-semibold mb-2">📖 File Content:</h2>
    <pre class="border p-2 whitespace-pre-wrap">{fileText}</pre>
  {/if}
</div>

<!-- List project -->
<ul class="space-y-2">
  {#each projects as project}
    <li class="p-4 border rounded flex justify-between items-center">
      <div>
        <p class="font-semibold">{project.title}</p>
        <p class="text-sm text-gray-600">{project.org} | {project.role}</p>
        <p class="text-sm">{project.outcomes}</p>
      </div>
      <div class="flex gap-2">
        <a
          href={`/projects/${project.id}`}
          class="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Edit
        </a>
        <button
          on:click={() => deleteProject(project.id)}
          class="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </li>
  {/each}
</ul>
