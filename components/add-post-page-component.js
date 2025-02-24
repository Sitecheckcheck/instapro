import { addPosts } from "../api.js";
import { getToken, goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

let imageUrl = "";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container">
      </div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
            <div class="upload=image">     
              <label class="file-upload-label secondary-button">
                <input type="file" class="file-upload-input" style="display:none">
                Выберите фото
              </label>
            </div>
          </div>
            <label>
              Опишите фотографию:
                <textarea class="input textarea" id="inputText" rows="4"></textarea>
            </label>
            <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div> 
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      const textInputElement = document.getElementById("inputText");

      if (!imageUrl) {
        alert("выберите фото");
        return;
      }

      if (!textInputElement.value) {
        alert("напишите описание");
        return;
      }

      addPosts({
        token: getToken(),
        description: textInputElement.value
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;"),
        imageUrl,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          goToPage(POSTS_PAGE);
        })
        .catch((error) => {
          console.log(error.message);
        });
    });
  };

  render();
}
