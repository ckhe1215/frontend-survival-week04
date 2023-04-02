import { useEffect, useState } from 'react';

async function getData() {
  const url = 'http://localhost:3000/restaurants';
  const response = await fetch(url);
  const data = await response.json();
  return data.restaurants;
}

type menuType = {
  id: number,
  name: string,
  price: number,
}

type restaurantType = {
  id: number,
  category: string,
  name: string,
  menu: menuType[],
}

// TODOS
// : 컴포넌트 분리
// : 식당 검색
// : CSS
// : 영수증 인터벌

export default function App() {
  const [data, setData] = useState<restaurantType[]>([]);
  const [selectedMenus, setSelectedMenus] = useState<menuType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
    };
    fetchData();
  }, []);

  function getMenu(restaurantId:number, menuId: number) {
    const selectedRestaurant = data.filter((item) => item.id === restaurantId);
    return selectedRestaurant[0].menu.filter((item) => item.id === menuId)[0];
  }

  function handleSelectMenu(restaurantId:number, menuId: number) {
    const newSelecteMenu = getMenu(restaurantId, menuId);
    setSelectedMenus((prevState) => [...prevState, newSelecteMenu]);
  }

  function getTotalPrice() {
    return selectedMenus.reduce((acc, cur) => acc + cur.price, 0);
  }

  return (
    <>
      <h1>푸드코트 키오스크</h1>
      <div>
        <h2>점심 바구니</h2>
        <ul>
          {selectedMenus.map((item) => (
            // TODO: id 중복 제거
            <li key={item.id}>
              {`${item.name}(${item.price.toLocaleString('kr')}원)`}
              <button type="button">취소</button>
            </li>
          ))}

        </ul>
        <button type="button">
          합계:
          {getTotalPrice()}
          원 주문
        </button>
      </div>
      <div>
        <label htmlFor="name-input">검색</label>
        <input type="text" id="name-input" placeholder="식당 이름" />
        <ul>
          <li><button type="button">전체</button></li>
          <li><button type="button">중식</button></li>
          <li><button type="button">한식</button></li>
          <li><button type="button">일식</button></li>
        </ul>
      </div>
      <table>
        <thead>
          <th>식당 이름</th>
          <th>종류</th>
          <th>메뉴</th>
        </thead>
        <tbody>
          {
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>
                  <ul>
                    {item.menu.map((menuItem) => (
                      <li key={menuItem.id}>
                        {`${menuItem.name}(${menuItem.price.toLocaleString('kr')}원)`}
                        <button
                          type="button"
                          onClick={() => { handleSelectMenu(item.id, menuItem.id); }}
                        >
                          선택
                        </button>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <div>
        <h3>영수증</h3>
        <h4>주문번호</h4>
        <h4>주문 목록</h4>
        <p>총 가격:</p>
      </div>
    </>
  );
}
