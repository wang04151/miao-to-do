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

  const [cleanliness, setCleanliness] = useState(80)
  const [intimacy, setIntimacy] = useState(85)

  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskTime, setNewTaskTime] = useState('30')

  useEffect(() => {
    localStorage.setItem('miao_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('miao_fish', String(fish))
  }, [fish])

  useEffect(() => {
    localStorage.setItem('miao_fullness', String(fullness))
  }, [fullness])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === '已完成').length
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

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
  }

  function completeTask(id) {
    setTasks(
      tasks.map((task) => {
        if (task.id === id && task.status !== '已完成') {
          setFish((prev) => prev + task.reward)
          setIntimacy((prev) => Math.min(100, prev + 3))
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
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  function feedCat() {
    if (fish < 10) {
      alert('小鱼干不够啦，先完成任务再喂猫吧～')
      return
    }

    setFish(fish - 10)
    setFullness((prev) => Math.min(100, prev + 10))
  }

  function groomCat() {
    setCleanliness((prev) => Math.min(100, prev + 10))
    setIntimacy((prev) => Math.min(100, prev + 5))
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

            <p>完成任务可以获得小鱼干，用来照顾小猫哦！</p>
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
          <button className="action green">
            <span>🎯</span>
            <b>开始专注</b>
            <small>选择任务后开始</small>
          </button>

          <button className="action yellow" onClick={groomCat}>
            <span>🪮</span>
            <b>梳毛</b>
            <small>提高亲密度</small>
          </button>

          <button className="action pink" onClick={feedCat}>
            <span>🐟</span>
            <b>喂猫</b>
            <small>消耗 10 小鱼干</small>
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
              💡 点击任务左侧圆圈 = 完成任务；点击任务文字 = 开始任务。
            </div>
          </div>

          <div className="cat-status-card">
            <div className="card-title">
              <h3>我的小猫</h3>
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
                ? '小猫吃得饱饱的，正在开心打滚～ ✨'
                : '小猫正在等你完成任务喂它小鱼干～'}
            </p>
          </div>
        </section>

        <section className="cat-scene">
          <div className="speech-bubble">
            {completedTasks >= totalTasks && totalTasks > 0
              ? '今天的任务都完成啦，主人好棒喵！'
              : '今天也要陪你完成任务喵～'}
          </div>

          <div className="cat">
            <div className="ear ear-left"></div>
            <div className="ear ear-right"></div>

            <div className="cat-face">
              <div className="eye eye-left"></div>
              <div className="eye eye-right"></div>
              <div className="nose"></div>
              <div className="mouth">ω</div>
            </div>

            <div className="cat-body"></div>
            <div className="cat-tail"></div>
            <div className="bell">🔔</div>
          </div>
        </section>

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