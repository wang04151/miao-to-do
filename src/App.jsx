import { useEffect, useState } from 'react'
import './App.css'

const defaultTasks = [
  {
    id: 1,
    name: '背单词',
    time: '30分钟',
    reward: 20,
    status: '已完成',
    icon: '📗',
  },
  {
    id: 2,
    name: '写报告',
    time: '45分钟',
    reward: 30,
    status: '进行中',
    icon: '📄',
  },
  {
    id: 3,
    name: '运动',
    time: '20分钟',
    reward: 15,
    status: '待开始',
    icon: '👟',
  },
]

function MyCatAvatar({
  catName,
  action,
  fullness,
  cleanliness,
  intimacy,
  completedTasks,
  totalTasks,
  onPet,
}) {
  const imageUrl = `${import.meta.env.BASE_URL}cats/mycat.png`

  const actionText = {
    idle: `我是 ${catName}，今天也会陪着你喵～`,
    happy: `${catName} 很开心！尾巴都要摇起来啦～`,
    sip: `${catName} 正在喝小鱼干奶茶，满足喵～`,
    play: `${catName} 正在玩逗猫棒，超兴奋！`,
    sleep: `${catName} 有点困了，正在软软睡觉～`,
    focus: `${catName} 陪你一起专注学习中。`,
  }

  const mood =
    fullness >= 85 && intimacy >= 80
      ? '心情很好'
      : fullness < 50
        ? '有点饿'
        : cleanliness < 50
          ? '想梳毛'
          : '安静陪伴'

  return (
    <section className={`my-cat-scene ${action}`}>
      <div className="cat-dialog">
        <div className="cat-dialog-title">🐱 {catName}</div>
        <p>{actionText[action] || actionText.idle}</p>
      </div>

      <div className="cat-badges">
        <span>状态：{mood}</span>
        <span>任务：{completedTasks}/{totalTasks}</span>
      </div>

      <button className="cat-click-area" onClick={onPet} aria-label="摸摸猫咪">
        <div className="cat-aura"></div>

        <img
          className="my-cat-img"
          src={imageUrl}
          alt={`${catName} 的 3D 小猫形象`}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />

        <div className="cat-shadow"></div>

        <span className="cat-sparkle sparkle-a">✦</span>
        <span className="cat-sparkle sparkle-b">✧</span>
        <span className="cat-sparkle sparkle-c">✦</span>

        {action === 'sleep' && (
          <div className="sleep-bubbles">
            <span>Z</span>
            <span>z</span>
            <span>z</span>
          </div>
        )}

        {action === 'play' && (
          <div className="toy-stick">
            <span>🪶</span>
          </div>
        )}

        {action === 'focus' && (
          <div className="focus-note">
            <span>专注中</span>
          </div>
        )}

        {action === 'sip' && (
          <div className="sip-note">
            <span>+ 饱食度</span>
          </div>
        )}
      </button>

      <div className="cat-mini-actions">
        <span>点击猫咪可以摸摸它</span>
      </div>
    </section>
  )
}

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('miao_tasks')
    return saved ? JSON.parse(saved) : defaultTasks
  })

  const [fish, setFish] = useState(() => {
    const saved = localStorage.getItem('miao_fish')
    return saved ? Number(saved) : 128
  })

  const [fullness, setFullness] = useState(() => {
    const saved = localStorage.getItem('miao_fullness')
    return saved ? Number(saved) : 75
  })

  const [cleanliness, setCleanliness] = useState(() => {
    const saved = localStorage.getItem('miao_cleanliness')
    return saved ? Number(saved) : 80
  })

  const [intimacy, setIntimacy] = useState(() => {
    const saved = localStorage.getItem('miao_intimacy')
    return saved ? Number(saved) : 85
  })

  const [catName, setCatName] = useState(() => {
    const saved = localStorage.getItem('miao_cat_name')
    return saved || '奶糖'
  })

  const [catAction, setCatAction] = useState('idle')
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskTime, setNewTaskTime] = useState('30')

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === '已完成').length
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  useEffect(() => {
    localStorage.setItem('miao_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('miao_fish', String(fish))
  }, [fish])

  useEffect(() => {
    localStorage.setItem('miao_fullness', String(fullness))
  }, [fullness])

  useEffect(() => {
    localStorage.setItem('miao_cleanliness', String(cleanliness))
  }, [cleanliness])

  useEffect(() => {
    localStorage.setItem('miao_intimacy', String(intimacy))
  }, [intimacy])

  useEffect(() => {
    localStorage.setItem('miao_cat_name', catName)
  }, [catName])

  function playCatAction(actionName, duration = 1300) {
    setCatAction(actionName)

    window.clearTimeout(window.__miaoTimer)
    window.__miaoTimer = window.setTimeout(() => {
      setCatAction('idle')
    }, duration)
  }

  function addTask() {
    if (!newTaskName.trim()) {
      alert('请先输入任务名称喵～')
      return
    }

    const minutes = Number(newTaskTime)
    const reward = Math.max(10, Math.round(minutes / 2))

    const newTask = {
      id: Date.now(),
      name: newTaskName.trim(),
      time: `${minutes}分钟`,
      reward,
      status: '待开始',
      icon: '📝',
    }

    setTasks([newTask, ...tasks])
    setNewTaskName('')
    setNewTaskTime('30')
    playCatAction('happy')
  }

  function completeTask(id) {
    setTasks(
      tasks.map((task) => {
        if (task.id === id && task.status !== '已完成') {
          setFish((prev) => prev + task.reward)
          setIntimacy((prev) => Math.min(100, prev + 4))
          playCatAction('happy')

          return {
            ...task,
            status: '已完成',
          }
        }

        return task
      })
    )
  }

  function startTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id && task.status !== '已完成'
          ? { ...task, status: '进行中' }
          : task
      )
    )

    playCatAction('focus', 1800)
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  function feedCat() {
    if (fish < 10) {
      alert('小鱼干不够啦，先完成任务再喂猫吧～')
      return
    }

    setFish((prev) => prev - 10)
    setFullness((prev) => Math.min(100, prev + 12))
    setIntimacy((prev) => Math.min(100, prev + 2))
    playCatAction('sip')
  }

  function groomCat() {
    setCleanliness((prev) => Math.min(100, prev + 12))
    setIntimacy((prev) => Math.min(100, prev + 5))
    playCatAction('happy')
  }

  function playWithCat() {
    setIntimacy((prev) => Math.min(100, prev + 6))
    setFullness((prev) => Math.max(0, prev - 3))
    playCatAction('play', 1600)
  }

  function sleepCat() {
    setFullness((prev) => Math.max(0, prev - 2))
    playCatAction('sleep', 2600)
  }

  function petCat() {
    setIntimacy((prev) => Math.min(100, prev + 2))
    playCatAction('happy')
  }

  return (
    <div className="app">
      <div className="phone">
        <header className="header">
          <div>
            <p className="greeting">早安，今天也一起加油 ☀️</p>
            <h1>喵待办 🐾</h1>
          </div>

          <div className="coin-box">🐟 小鱼干 {fish}</div>
        </header>

        <section className="progress-card">
          <div className="progress-icon">📋</div>

          <div className="progress-info">
            <h2>
              今日任务 <span>{completedTasks}</span>/{totalTasks}
            </h2>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p>完成任务可以获得小鱼干，用来照顾你的小猫。</p>
          </div>
        </section>

        <section className="add-panel">
          <input
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="输入待办事项，例如：复习英语"
          />

          <select
            value={newTaskTime}
            onChange={(e) => setNewTaskTime(e.target.value)}
          >
            <option value="15">15分钟</option>
            <option value="30">30分钟</option>
            <option value="45">45分钟</option>
            <option value="60">60分钟</option>
          </select>

          <button onClick={addTask}>添加任务</button>
        </section>

        <section className="quick-actions">
          <button className="action green" onClick={() => playCatAction('focus', 1800)}>
            <span>🎯</span>
            <b>开始专注</b>
            <small>小猫陪你学习</small>
          </button>

          <button className="action yellow" onClick={groomCat}>
            <span>🪮</span>
            <b>梳毛</b>
            <small>清洁 + 亲密</small>
          </button>

          <button className="action pink" onClick={feedCat}>
            <span>🐟</span>
            <b>喂猫</b>
            <small>消耗 10 小鱼干</small>
          </button>
        </section>

        <section className="quick-actions second-actions">
          <button className="action purple" onClick={playWithCat}>
            <span>🪶</span>
            <b>逗猫</b>
            <small>提高亲密度</small>
          </button>

          <button className="action blue" onClick={sleepCat}>
            <span>🌙</span>
            <b>睡觉</b>
            <small>休息一下</small>
          </button>

          <button className="action cream" onClick={petCat}>
            <span>🤍</span>
            <b>摸摸</b>
            <small>轻轻互动</small>
          </button>
        </section>

        <section className="content-grid">
          <div className="task-card">
            <div className="card-title">
              <h3>任务清单</h3>
              <p>{completedTasks}/{totalTasks}</p>
            </div>

            {tasks.length === 0 && (
              <p className="empty-text">今天还没有任务，先添加一个吧～</p>
            )}

            {tasks.map((task) => (
              <div className="task-row" key={task.id}>
                <button
                  className={task.status === '已完成' ? 'circle checked' : 'circle'}
                  onClick={() => completeTask(task.id)}
                >
                  {task.status === '已完成' ? '✓' : ''}
                </button>

                <div className="task-icon">{task.icon}</div>

                <div className="task-text" onClick={() => startTask(task.id)}>
                  <b>{task.name}</b>
                  <small>
                    {task.time} · 🐟 +{task.reward}
                  </small>
                </div>

                <div
                  className={
                    task.status === '已完成'
                      ? 'tag done'
                      : task.status === '进行中'
                        ? 'tag doing'
                        : 'tag'
                  }
                >
                  {task.status}
                </div>

                <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                  ×
                </button>
              </div>
            ))}

            <div className="small-tip">
              💡 点击左侧圆圈 = 完成任务；点击任务文字 = 开始任务。
            </div>
          </div>

          <div className="cat-status-card">
            <div className="card-title">
              <h3>{catName || '小猫'} 的状态</h3>
              <p>Lv.6</p>
            </div>

            <div className="status-item">
              <div>
                <b>🍚 饱食度</b>
                <span>{fullness}%</span>
              </div>
              <div className="status-bar">
                <i style={{ width: `${fullness}%` }}></i>
              </div>
            </div>

            <div className="status-item">
              <div>
                <b>🫧 清洁度</b>
                <span>{cleanliness}%</span>
              </div>
              <div className="status-bar">
                <i style={{ width: `${cleanliness}%` }}></i>
              </div>
            </div>

            <div className="status-item">
              <div>
                <b>💗 亲密度</b>
                <span>{intimacy}%</span>
              </div>
              <div className="status-bar">
                <i className="pink-bar" style={{ width: `${intimacy}%` }}></i>
              </div>
            </div>

            <p className="cat-mood">
              {fullness >= 90
                ? `${catName || '小猫'}吃得饱饱的，正在开心陪你～ ✨`
                : `${catName || '小猫'}正在等你完成任务喂它小鱼干～`}
            </p>
          </div>
        </section>

        <section className="cat-editor-card">
          <div className="card-title">
            <h3>我的小猫</h3>
            <p>专属形象</p>
          </div>

          <div className="cat-editor-grid single-cat-editor">
            <label>
              <span>名字</span>
              <input
                value={catName}
                onChange={(e) => {
                  setCatName(e.target.value)
                  playCatAction('happy')
                }}
                placeholder="给小猫起名字"
              />
            </label>
          </div>
        </section>

        <MyCatAvatar
          catName={catName || '小猫'}
          action={catAction}
          fullness={fullness}
          cleanliness={cleanliness}
          intimacy={intimacy}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          onPet={petCat}
        />

        <nav className="bottom-nav">
          <div className="active">🏠<span>首页</span></div>
          <div>📋<span>任务</span></div>
          <div>⏱<span>专注</span></div>
          <div>🐱<span>小猫</span></div>
          <div>🛍<span>商店</span></div>
        </nav>
      </div>
    </div>
  )
}

export default App