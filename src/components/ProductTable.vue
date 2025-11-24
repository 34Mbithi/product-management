<template>
  <div class="overflow-x-auto bg-white rounded shadow">
    <table class="w-full">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-3 text-left">Image</th>
          <th class="p-3 text-left">Title</th>
          <th class="p-3 text-left">Category</th>
          <th class="p-3 text-left">Price</th>
          <th class="p-3 text-left">Stock</th>
          <th class="p-3 text-left">Action</th>
        </tr>
      </thead>

      <tbody>
        <slot></slot>
      </tbody>
    </table>
  </div>
</template>
