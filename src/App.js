import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [tempId, setId] = useState(0);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const URL = 'http://127.0.0.1:9000/transactions';

  let fetchData = useCallback(async () =>{
    const res = await axios.get(URL);
    if(res){
      setPosts(res.data)
    }
  },[])

  useEffect(() => {
    fetchData()
  },[])

  function newPost(){
    axios.put(URL, {
      title: newTitle,
      category: newCategory,
      price: newPrice
    })
  }

  function deletePost(){
    axios.delete(URL)
    .then(() => {
      alert("Deleted!");
      setPosts(null);
    })
  }

  return (
    <div>
      <input 
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        placeholder="New Title"
      />
      <input 
        value={newCategory}
        onChange={e => setNewCategory(e.target.value)}
        placeholder="New Category"
      />
      <input 
        value={newPrice}
        onChange={e => setNewPrice(parseFloat(e.target.value))}
      />
      <button onClick={newPost}>New Post</button>

      <ul>

        {posts.map(post =>
          <div key={post.id}>
            <h1 >{post.title}</h1>
            <p>{post.category}</p>
            <p>${post.price.toFixed(2)}</p>
          </div>
        )}
      </ul>
    </div>
  );
}

export default App;
