import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { addLike, deleteLike } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const postHtml = posts
    .map((post) => {
      return `
                  <li class="post">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${
                          post.user.imageUrl
                        }" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${post.id}"  data-liked = "${
        post.isLiked
      }" class="like-button">
                        <img src="./assets/images/${
                          post.isLiked
                            ? "like-active.svg"
                            : "like-not-active.svg"
                        }">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong id='${post.id}'>${
        post.likes.length
      }</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                    ${post.date}
                    </p>
                  </li>`;
    })
    .join("");

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      // console.log(userEl.dataset.userId);

      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let postEl of document.querySelectorAll(".like-button")) {
    postEl.addEventListener("click", () => {
      postEl.disabled = true;

      if (postEl.dataset.liked == "false") {
        addLike({ token: getToken(), postId: postEl.dataset.postId }).then(
          () => {
            postEl.innerHTML = `<img src="./assets/images/like-active.svg">`;
            document.getElementById(`${postEl.dataset.postId}`).innerHTML++;
            postEl.dataset.liked = "true";
            postEl.disabled = false;
          }
        );
      } else {
        deleteLike({ token: getToken(), postId: postEl.dataset.postId }).then(
          () => {
            postEl.innerHTML = `<img src="./assets/images/like-not-active.svg">`;
            document.getElementById(`${postEl.dataset.postId}`).innerHTML--;
            postEl.dataset.liked = "false";
            postEl.disabled = false;
          }
        );
      }
    });
  }
}
