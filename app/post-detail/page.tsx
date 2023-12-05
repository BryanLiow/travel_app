import React from "react";
import PostDetail from "../../components/PostDetail";

export default function Page() {
  // No props are passed to PostDetail, it handles its own data fetching
  return <PostDetail />;
}
