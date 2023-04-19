import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { addLike, deleteLike } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderPostsPageComponent({ appEl }) {
  let i = -1;
  const postHtml = posts
    .map((post) => {
      const dateFormat = formatDistanceToNow(new Date(post.createdAt), {
        locale: ru,
      });
      i = i + 1;
      return `
                  <li class="post" data-index = ${i} >
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
                      <p  class="post-likes-text">
                      Нравится: <strong id='${post.id}'>${
        post.likes.length > 1
          ? post.likes[0].name + " и еще " + (post.likes.length - 1)
          : post.likes.length == 1
          ? post.likes[0].name
          : post.likes.length
      }  </strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                    ${dateFormat}
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
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let postEl of document.querySelectorAll(".like-button")) {
    postEl.addEventListener("click", () => {
      let index = postEl.closest(".post").dataset.index;

      if (posts[index].isLiked === false) {
        addLike({ token: getToken(), postId: postEl.dataset.postId }).then(
          () => {
            posts[index].isLiked = true;
            posts[index].likes.push({
              id: posts[index].user.id,
              name: posts[index].user.name,
            });

            renderPostsPageComponent({ appEl });
          }
        );
      } else {
        deleteLike({ token: getToken(), postId: postEl.dataset.postId }).then(
          () => {
            posts[index].isLiked = false;
            posts[index].likes.pop();
            renderPostsPageComponent({ appEl });
          }
        );
      }
    });
  }
}
