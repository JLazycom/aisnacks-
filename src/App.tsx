import { useMemo, useState, type CSSProperties } from "react";
import vendingRoom from "./assets/pastel-vending-room.png";
import snackSheet from "./assets/ai-snacks-grid.png";

type Product = {
  id: number;
  code: string;
  name: string;
  type: string;
  price: number;
  description: string;
  tags: string[];
};

const products: Product[] = [
  { id: 0, code: "A1", name: "Neural Crunch", type: "Промт-чипсы", price: 390, description: "Свежие идеи, точные концепции и сильные креативные связи — в одной хрустящей упаковке.", tags: ["идеи", "тексты", "фокус"] },
  { id: 1, code: "A2", name: "Data Bar", type: "Энерго-промт", price: 450, description: "Превращает большие массивы данных в понятные выводы, таблицы и готовую стратегию.", tags: ["анализ", "данные", "стратегия"] },
  { id: 2, code: "A3", name: "Synapse Pop", type: "Промт-мармелад", price: 320, description: "Быстрый брейншторм и неожиданные творческие повороты для визуальных и текстовых задач.", tags: ["брейншторм", "визуал", "идеи"] },
  { id: 3, code: "A4", name: "Quantum Chips", type: "Ультра-промт", price: 520, description: "Продвинутая смесь для сложных задач: исследование, декомпозиция и чёткий план.", tags: ["research", "план", "система"] },
  { id: 4, code: "A5", name: "Cyber Mint", type: "Промт-мятные", price: 280, description: "Освежает перегруженный контекст и превращает его в ясную работающую инструкцию.", tags: ["ясность", "редактура", "тон"] },
  { id: 5, code: "B1", name: "Logic Gum", type: "Промт-жвачка", price: 300, description: "Проверяет логику, находит слабые места и помогает принять взвешенное решение.", tags: ["логика", "проверка", "решения"] },
  { id: 6, code: "B2", name: "Algorithm Bites", type: "Промт-печенье", price: 410, description: "Пошаговый рецепт для автоматизации, кода и технических задач без лишней воды.", tags: ["код", "алгоритмы", "автоматизация"] },
  { id: 7, code: "B3", name: "Memory Foam", type: "Облачное суфле", price: 360, description: "Собирает контекст проекта и упаковывает его в удобную базу знаний.", tags: ["память", "контекст", "база"] },
  { id: 8, code: "B4", name: "Cache Cookies", type: "Промт-печенье", price: 430, description: "Сохраняет лучшие паттерны и ускоряет повторяющиеся командные задачи.", tags: ["шаблоны", "команда", "скорость"] },
  { id: 9, code: "B5", name: "Bandwidth Bars", type: "Макси-промт", price: 590, description: "Флагманский набор для максимальной производительности — от идеи до результата.", tags: ["performance", "workflow", "pro"] },
];

const hotspotPositions = [
  [26.2, 21.1], [35.5, 21.5], [44.6, 21.5], [53.8, 21.5], [63.1, 21.7],
  [26.3, 42.1], [35.5, 42.2], [44.7, 42.3], [53.9, 42.3], [63.1, 42.3],
];

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.8 8.5h10.4l1 11H5.8l1-11Z" />
      <path d="M9 9V6.7a3 3 0 0 1 6 0V9" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function ProductImage({ product }: { product: Product }) {
  const column = product.id % 5;
  const row = Math.floor(product.id / 5);

  return (
    <div className="product-crop">
      <img
        src={snackSheet}
        alt={`Упаковка ${product.name}`}
        style={{
          width: "500%",
          height: "200%",
          left: `${column * -100}%`,
          top: `${row * -100}%`,
        }}
      />
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [notice, setNotice] = useState("");
  const [introVisible, setIntroVisible] = useState(true);

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const total = useMemo(
    () => products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0),
    [cart],
  );

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  };

  const addToCart = (product: Product) => {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }));
    notify(`${product.name} добавлен в выдачу`);
  };

  const changeQuantity = (id: number, amount: number) => {
    setCart((current) => {
      const updated = { ...current, [id]: Math.max(0, (current[id] || 0) + amount) };
      if (!updated[id]) delete updated[id];
      return updated;
    });
  };

  return (
    <main className="vending-page">
      <header className="floating-nav">
        <button className="mini-brand" onClick={() => setIntroVisible(true)}>
          <span>△</span>
          <div><strong>AI SNACKS</strong><small>Fuel your mind</small></div>
        </button>
        <div className="live-pill"><i /> Автомат онлайн</div>
        <button className="cart-pill" onClick={() => setCartOpen(true)}>
          <BagIcon />
          <span>Корзина</span>
          <b>{cartCount}</b>
        </button>
      </header>

      <section className="scene-viewport" aria-label="Интерактивный автомат AI Snacks">
        <div className="image-stage">
          <img className="room-image" src={vendingRoom} alt="Пастельный автомат AI Snacks в ретрофутуристической комнате" />
          <div className="warm-glow" />
          <div className="glass-sheen" />

          {products.map((product, index) => {
            const [left, top] = hotspotPositions[index];
            return (
              <button
                className="snack-hotspot"
                key={product.id}
                style={{ "--left": `${left}%`, "--top": `${top}%` } as CSSProperties}
                onClick={() => { setSelected(product); setIntroVisible(false); }}
                aria-label={`Выбрать ${product.name}, ${product.price} рублей`}
              >
                <span className="hotspot-code">{product.code}</span>
                <span className="hotspot-info">
                  <strong>{product.name}</strong>
                  <small>{product.price} ₽ · посмотреть</small>
                </span>
              </button>
            );
          })}

          <button className="touch-screen" onClick={() => setCartOpen(true)}>
            <span>{cartCount ? `${cartCount} снек${cartCount > 1 ? "а" : ""} готово` : "Коснись для заказа"}</span>
            <strong>{cartCount ? `${total.toLocaleString("ru-RU")} ₽` : "SELECT & TAP"}</strong>
          </button>

          <button className="nfc-hotspot" onClick={() => { setCartOpen(true); notify("NFC-панель активирована"); }} aria-label="Открыть оплату">
            <span>Оплата</span>
          </button>

          <button className="pickup-hotspot" onClick={() => cartCount ? setCartOpen(true) : notify("Сначала выбери снек в витрине")}>
            <span>{cartCount ? "Заказ готов к выдаче" : "Отсек выдачи"}</span>
          </button>
        </div>
      </section>

      {introVisible && (
        <aside className="intro-card">
          <button className="intro-close" onClick={() => setIntroVisible(false)} aria-label="Закрыть"><CloseIcon /></button>
          <p>Интерактивный AI-маркет</p>
          <h1>Промты, которые хочется попробовать</h1>
          <span>Нажми на любую упаковку в витрине — автомат покажет состав и добавит её в выдачу.</span>
          <button className="intro-action" onClick={() => setIntroVisible(false)}>Выбрать первый вкус <b>→</b></button>
        </aside>
      )}

      <div className="scene-caption">
        <span>10 авторских промтов</span>
        <i />
        <span>Моментальная доставка</span>
        <i />
        <span>Работает 24/7</span>
      </div>

      {selected && (
        <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}>
          <section className="product-modal" role="dialog" aria-modal="true" aria-label={selected.name}>
            <button className="close-button" onClick={() => setSelected(null)} aria-label="Закрыть"><CloseIcon /></button>
            <div className="modal-product">
              <div className="modal-halo" />
              <ProductImage product={selected} />
              <span className="modal-code">{selected.code}</span>
            </div>
            <div className="modal-copy">
              <p>{selected.type} · digital edition</p>
              <h2>{selected.name}</h2>
              <span className="rating">★★★★★ <small>4.9 · выбор AI-команды</small></span>
              <div className="description">{selected.description}</div>
              <div className="tags">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="buy-row">
                <div><small>Цена</small><strong>{selected.price} ₽</strong></div>
                <button onClick={() => { addToCart(selected); setSelected(null); }}>Добавить <span>→</span></button>
              </div>
            </div>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="overlay drawer-overlay" onMouseDown={(event) => event.target === event.currentTarget && setCartOpen(false)}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Корзина">
            <div className="drawer-head">
              <div><p>AI SNACKS · ORDER</p><h2>Ваша выдача</h2></div>
              <button className="close-button" onClick={() => setCartOpen(false)} aria-label="Закрыть"><CloseIcon /></button>
            </div>
            <div className="cart-list">
              {!cartCount && (
                <div className="empty-cart">
                  <span>00</span>
                  <strong>Автомат ждёт выбор</strong>
                  <p>Вернись к витрине и нажми на упаковку, которая тебе понравилась.</p>
                  <button onClick={() => setCartOpen(false)}>К витрине <b>→</b></button>
                </div>
              )}
              {products.filter((product) => cart[product.id]).map((product) => (
                <article className="cart-item" key={product.id}>
                  <ProductImage product={product} />
                  <div className="cart-item-copy"><strong>{product.name}</strong><small>{product.type}</small><span>{product.price} ₽</span></div>
                  <div className="quantity">
                    <button onClick={() => changeQuantity(product.id, -1)} aria-label="Уменьшить">−</button>
                    <span>{cart[product.id]}</span>
                    <button onClick={() => changeQuantity(product.id, 1)} aria-label="Увеличить">+</button>
                  </div>
                </article>
              ))}
            </div>
            {!!cartCount && (
              <div className="checkout">
                <p><span>К оплате</span><strong>{total.toLocaleString("ru-RU")} ₽</strong></p>
                <button onClick={() => { setCart({}); setCartOpen(false); notify("Оплата прошла — промты уже летят к тебе"); }}>
                  Оплатить и получить <span>→</span>
                </button>
                <small>Безопасная цифровая выдача · сразу после оплаты</small>
              </div>
            )}
          </aside>
        </div>
      )}

      {notice && <div className="toast" role="status"><i />{notice}</div>}
    </main>
  );
}
