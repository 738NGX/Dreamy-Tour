import { Channel } from "./channel/channel";
import { Group } from "./channel/group";
import { Comment, Post } from "./channel/post";
import { channelList } from "./testData/channel";
import { commentList } from "./testData/comment";
import { groupList } from "./testData/group";
import { postList } from "./testData/post";
import { tourList } from "./testData/tour";
import { userList } from "./testData/user";
import { Tour } from "./tour/tour";
import { User } from "./user/user";

export const testData = {
  userList: userList.map(user => new User(user)),
  channelList: channelList.map(channel => new Channel(channel)),
  groupList: groupList.map(group => new Group(group)),
  tourList: tourList.map(tour => new Tour(tour)),
  postList: postList.map(post => new Post(post)),
  commentList: commentList.map(comment => new Comment(comment)),
}







