async function saveNFTs() {
    try {
        // Use insertMany to save multiple documents
        await nftmodel.insertMany([
  
            {
              imageUrl:
                "https://static.vecteezy.com/system/resources/previews/017/047/854/original/cute-cat-illustration-cat-kawaii-chibi-drawing-style-cat-cartoon-vector.jpg",
              name: "WhiskerWonder",
              price: 100,
            
            },
           
              {
                  imageUrl: "https://tse2.mm.bing.net/th?id=OIP.k2eoCuJURupJuyJkJI3xHQHaHa&pid=Api&P=0&h=180",
                  name: "PurrFury",
                  price: 150
              },
              {
                  imageUrl: "https://i.pinimg.com/736x/b3/4c/93/b34c93e00c171542d09bea554db84ce6.jpg",
                  name: "MeowMystique",
                  price: 120
              },
              {
                  imageUrl: "https://i.pinimg.com/originals/e1/c4/1a/e1c41ae91d8c2ba519660aaf54223081.jpg",
                  name: "ClawCraft",
                  price: 200
              },
              {
                  imageUrl: "https://i.pinimg.com/originals/eb/af/63/ebaf638ea41117a48351d63c0e0cef56.jpg",
                  name: "FelineFinesse",
                  price: 18
              },
              {
                  imageUrl: "https://i.pinimg.com/originals/08/91/1d/08911d37d7a58dec43b257e9a521211e.jpg",
                  name: "PawsomePixels",
                  price: 130
              },
              {
                  imageUrl: "https://i.pinimg.com/originals/58/7d/39/587d39f61e9fddfb6d6289b251437714.jpg",
                  name: "TabbyTreasure",
                  price: 190
              },
             
          
          
    ]);
        console.log('NFTs saved successfully');
    } catch (error) {
        console.error('Error saving NFTs:', error);
    }
}