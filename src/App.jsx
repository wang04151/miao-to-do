import { useEffect, useMemo, useState } from 'react'
import './App.css'

const defaultTasks = [
  {
    id: 1,
    name: '背单词',
    time: '30分钟',
    reward: 20,
    status: '已完成',
    icon: '📗',
    reminderAt: '',
    reminded: false,
  },
  {
    id: 2,
    name: '写报告',
    time: '45分钟',
    reward: 30,
    status: '进行中',
    icon: '📄',
    reminderAt: '',
    reminded: false,
  },
  {
    id: 3,
    name: '运动',
    time: '20分钟',
    reward: 15,
    status: '待开始',
    icon: '👟',
    reminderAt: '',
    reminded: false,
  },
]

const actionTextMap = {
  walk: '我正在房间里来回巡视，看看你有没有认真完成任务喵～',
  idle: '我在这里等你，快来摸摸我吧～',
  lie: '我现在躺着看电视，进入休息模式啦～',
  happy: '被你摸摸之后超开心，尾巴都要摇起来啦！',
  feed: '谢谢你喂我，小肚子变得饱饱的～',
  groom: '梳毛真舒服，我现在香香软软的啦～',
  play: '正在玩逗猫棒，精神满满！',
  sleep: '有点困啦，先睡一小会儿……Zzz',
  focus: '专注模式开启，我会陪你一起完成任务。',
  remind: '提醒时间到啦！该开始任务了，我会监督你喵～',
}

const walkFrames = [
  'cats/mycat-walk-1.png',
  'cats/mycat-walk-2.png',
  'cats/mycat-walk-3.png',
  'cats/mycat-walk-4.png',
]

function formatReminderTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${month}/${day} ${hour}:${minute}`
}

function CatCompanion({
  catName,
  action,
  frame,
  catX,
  direction,
  isTurning,
  isPaused,
  fullness,
  cleanliness,
  intimacy,
  completedTasks,
  totalTasks,
  onPet,
  onWalk,
  onIdle,
  onLie,
  onSleep,
  onPlay,
}) {
  const baseUrl = import.meta.env.BASE_URL
  const isLieMode = action === 'lie' || action === 'sleep'
  const catImage = isLieMode
    ? `${baseUrl}cats/mycat-lie-tv.png`
    : `${baseUrl}${walkFrames[frame]}`

  const moodText = useMemo(() => {
    if (fullness < 40) return '有点饿'
    if (cleanliness < 45) return '想梳毛'
    if (completedTasks === totalTasks && totalTasks > 0) return '超开心'
    if (intimacy >= 90) return '非常亲近你'
    return '心情很好'
  }, [fullness, cleanliness, intimacy, completedTasks, totalTasks])

  const sceneStatus =
    action === 'walk'
      ? '散步中'
      : action === 'idle'
        ? '待机中'
        : action === 'lie'
          ? '看电视'
          : action === 'sleep'
            ? '睡觉中'
            : action === 'focus'
              ? '专注中'
              : action === 'remind'
                ? '提醒中'
                : '互动中'

  const walkerStyle = isLieMode
    ? undefined
    : action === 'walk'
      ? {
          left: `${catX}%`,
          transform: `translateX(-50%) scaleX(${direction})`,
        }
      : {
          left: '50%',
          transform: 'translateX(-50%) scaleX(1)',
        }

  return (
    <section className={`live-cat-card ${action}`}>
      <div className="cat-dialog-box">
        <strong>🐱 {catName}</strong>
        <p>{actionTextMap[action] || actionTextMap.walk}</p>
      </div>

      <div className="cat-status-tags">
        <span>状态：{moodText}</span>
        <span>动作：{sceneStatus}</span>
        <span>任务：{completedTasks}/{totalTasks}</span>
      </div>

      <div className={`cat-room ${isLieMode ? 'room-lie' : 'room-walk'}`}>
        <div className="room-light"></div>
        <div className="room-floor"></div>

        {(action === 'lie' || action === 'sleep') && (
          <div className="tv-area">
            <div className="tv-screen">
              <div className="tv-glow"></div>
              <span>📺</span>
            </div>
            <div className="tv-base"></div>
          </div>
        )}

        {action === 'play' && (
          <div className="cat-toy">
            <span>🪶</span>
          </div>
        )}

        {action === 'sleep' && (
          <div className="zzz">
            <span>Z</span>
            <span>z</span>
            <span>z</span>
          </div>
        )}

        {action === 'feed' && <div className="floating-note">+ 饱食度</div>}
        {action === 'groom' && <div className="floating-note">+ 清洁度</div>}
        {action === 'happy' && <div className="floating-note">+ 亲密度</div>}
        {action === 'focus' && <div className="floating-note">专注中</div>}
        {action === 'remind' && <div className="floating-note">该开始啦</div>}

        {action === 'walk' && (
          <>
            <span className="paw-print paw-1">🐾</span>
            <span className="paw-print paw-2">🐾</span>
            <span className="paw-print paw-3">🐾</span>
          </>
        )}

        <button className="cat-hit-area" onClick={onPet} aria-label="摸摸猫咪">
          <div
            className={`cat-walker ${isLieMode ? 'lie-wrap' : 'walk-wrap'} ${
              isTurning ? 'turning' : ''
            } ${isPaused ? 'paused' : ''}`}
            style={walkerStyle}
          >
            <img
              className={`real-cat-img ${isLieMode ? 'lie-img' : 'walk-img'}`}
              src={catImage}
              alt={`${catName} 的动态猫咪形象`}
              draggable="false"
            />
          </div>
        </button>

        <div className="cat-floor-shadow"></div>

        <span className="room-sparkle sparkle-one">✦</span>
        <span className="room-sparkle sparkle-two">✧</span>
        <span className="room-sparkle sparkle-three">✦</span>
      </div>

      <div className="cat-control-row">
        <button onClick={onWalk}>来回走动</button>
        <button onClick={onIdle}>待机卖萌</button>
        <button onClick={onLie}>躺着看电视</button>
        <button onClick={onPlay}>逗猫</button>
        <button onClick={onSleep}>睡觉</button>
      </div>

      <p className="cat-click-tip">点击猫咪可以摸摸它，动作会更灵动。</p>
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
    return localStorage.getItem('miao_cat_name') || '八嘎'
  })

  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskTime, setNewTaskTime] = useState('30')
  const [newTaskReminder, setNewTaskReminder] = useState('')

  const [catAction, setCatAction] = useState('walk')
  const [catFrame, setCatFrame] = useState(0)
  const [catX, setCatX] = useState(16)
  const [catDirection, setCatDirection] = useState(1)
  const [isTurning, setIsTurning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [catSpeed, setCatSpeed] = useState(1.35)

  const [notificationStatus, setNotificationStatus] = useState(() => {
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission
  })

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

  function pauseCatNaturally() {
    setIsPaused(true)
    window.clearTimeout(window.__miaoPauseTimer)

    window.__miaoPauseTimer = window.setTimeout(() => {
      setIsPaused(false)
    }, 500 + Math.random() * 700)
  }

  function turnCatNaturally() {
    setIsPaused(true)
    setIsTurning(true)

    window.clearTimeout(window.__miaoTurnTimer)
    window.clearTimeout(window.__miaoResumeTimer)

    window.__miaoTurnTimer = window.setTimeout(() => {
      setCatDirection((prev) => prev * -1)
      setCatFrame(0)
      setCatSpeed(1.05 + Math.random() * 1.0)

      window.__miaoResumeTimer = window.setTimeout(() => {
        setIsTurning(false)
        setIsPaused(false)
      }, 180)
    }, 360)
  }

  useEffect(() => {
    if (catAction !== 'walk' || isPaused) return

    const frameTimer = window.setInterval(() => {
      setCatFrame((prev) => (prev + 1) % walkFrames.length)
    }, 115)

    return () => window.clearInterval(frameTimer)
  }, [catAction, isPaused])

  useEffect(() => {
    if (catAction !== 'walk' || isPaused) return

    const moveTimer = window.setInterval(() => {
      setCatX((prev) => {
        const next = prev + catDirection * catSpeed
        const randomPause = Math.random() < 0.035

        if (randomPause) {
          pauseCatNaturally()
          return prev
        }

        if (next >= 78 || next <= 16) {
          turnCatNaturally()
          return Math.max(16, Math.min(78, next))
        }

        return next
      })
    }, 85)

    return () => window.clearInterval(moveTimer)
  }, [catAction, isPaused, catDirection, catSpeed])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCatAction((prev) => {
        if (['happy', 'feed', 'groom', 'play', 'focus', 'remind'].includes(prev)) {
          return prev
        }

        const random = Math.random()

        if (prev === 'walk') {
          if (random < 0.45) return 'idle'
          if (random < 0.72) return 'lie'
          if (random < 0.86) return 'sleep'
          return 'walk'
        }

        if (prev === 'idle') {
          if (random < 0.55) return 'walk'
          if (random < 0.75) return 'lie'
          if (random < 0.9) return 'sleep'
          return 'idle'
        }

        if (prev === 'lie') {
          if (random < 0.45) return 'walk'
          if (random < 0.7) return 'idle'
          if (random < 0.88) return 'sleep'
          return 'lie'
        }

        if (prev === 'sleep') {
          if (random < 0.5) return 'lie'
          if (random < 0.8) return 'idle'
          return 'walk'
        }

        return 'walk'
      })

      setCatSpeed(1.05 + Math.random() * 1.0)
    }, 11000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()

      const dueTasks = tasks.filter((task) => {
        if (!task.reminderAt) return false
        if (task.reminded) return false
        if (task.status === '已完成') return false

        const reminderTime = new Date(task.reminderAt).getTime()
        return !Number.isNaN(reminderTime) && now >= reminderTime
      })

      if (dueTasks.length === 0) return

      dueTasks.forEach((task) => {
        sendTaskNotification(task)
      })

      setTasks((prev) =>
        prev.map((task) =>
          dueTasks.some((due) => due.id === task.id)
            ? {
                ...task,
                reminded: true,
                status: task.status === '待开始' ? '进行中' : task.status,
              }
            : task
        )
      )

      playTemporaryAction('remind', 2600)
    }, 10000)

    return () => clearInterval(timer)
  }, [tasks])

  function requestNotificationPermission() {
    if (!('Notification' in window)) {
      alert('你的浏览器不支持系统提醒。')
      setNotificationStatus('unsupported')
      return
    }

    Notification.requestPermission().then((permission) => {
      setNotificationStatus(permission)

      if (permission === 'granted') {
        alert('提醒权限已开启！到时间后会弹出任务提醒。')
      } else {
        alert('你没有允许提醒权限，之后只能在页面内看到提醒。')
      }
    })
  }

  function sendTaskNotification(task) {
    const title = '喵待办提醒 🐱'
    const body = `该开始做：${task.name}｜预计 ${task.time}`

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: `${import.meta.env.BASE_URL}cats/mycat-walk-1.png`,
      })
    } else {
      alert(`${title}\n${body}`)
    }
  }

  function playTemporaryAction(action, duration = 1600) {
    setCatAction(action)
    setIsPaused(false)
    setIsTurning(false)

    window.clearTimeout(window.__miaoActionTimer)

    if (!['walk', 'idle', 'lie', 'sleep'].includes(action)) {
      window.__miaoActionTimer = window.setTimeout(() => {
        const nextActions = ['walk', 'idle', 'lie']
        const next = nextActions[Math.floor(Math.random() * nextActions.length)]
        setCatAction(next)
      }, duration)
    }
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
      reminderAt: newTaskReminder,
      reminded: false,
    }

    setTasks([newTask, ...tasks])
    setNewTaskName('')
    setNewTaskTime('30')
    setNewTaskReminder('')
    playTemporaryAction('happy')
  }

  function completeTask(id) {
    setTasks(
      tasks.map((task) => {
        if (task.id === id && task.status !== '已完成') {
          setFish((prev) => prev + task.reward)
          setIntimacy((prev) => Math.min(100, prev + 4))
          playTemporaryAction('happy')

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

    playTemporaryAction('focus', 2200)
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
    playTemporaryAction('feed')
  }

  function groomCat() {
    setCleanliness((prev) => Math.min(100, prev + 12))
    setIntimacy((prev) => Math.min(100, prev + 5))
    playTemporaryAction('groom')
  }

  function petCat() {
    setIntimacy((prev) => Math.min(100, prev + 2))
    playTemporaryAction('happy')
  }

  function playWithCat() {
    setIntimacy((prev) => Math.min(100, prev + 6))
    setFullness((prev) => Math.max(0, prev - 3))
    playTemporaryAction('play', 2200)
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
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <p>完成任务可以获得小鱼干，用来照顾你的小猫。</p>
          </div>
        </section>

        <section className="reminder-card">
          <div>
            <h3>提醒功能</h3>
            <p>
              状态：
              {notificationStatus === 'granted'
                ? '已开启'
                : notificationStatus === 'denied'
                  ? '已拒绝'
                  : notificationStatus === 'unsupported'
                    ? '浏览器不支持'
                    : '未开启'}
            </p>
          </div>

          <button onClick={requestNotificationPermission}>开启提醒权限</button>
        </section>

        <section className="add-panel reminder-add-panel">
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

          <input
            type="datetime-local"
            value={newTaskReminder}
            onChange={(e) => setNewTaskReminder(e.target.value)}
            title="选择提醒时间"
          />

          <button onClick={addTask}>添加任务</button>
        </section>

        <section className="quick-actions">
          <button className="action green" onClick={() => playTemporaryAction('focus', 2200)}>
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

          <button className="action blue" onClick={() => setCatAction('sleep')}>
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

                  {task.reminderAt && (
                    <small className={task.reminded ? 'reminder-text reminded' : 'reminder-text'}>
                      ⏰ {formatReminderTime(task.reminderAt)}
                      {task.reminded ? ' · 已提醒' : ''}
                    </small>
                  )}
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
              💡 选择提醒时间后，到点会弹出提醒；点击任务文字 = 开始任务。
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
                  playTemporaryAction('happy')
                }}
                placeholder="给小猫起名字"
              />
            </label>
          </div>
        </section>

        <CatCompanion
          catName={catName || '小猫'}
          action={catAction}
          frame={catFrame}
          catX={catX}
          direction={catDirection}
          isTurning={isTurning}
          isPaused={isPaused}
          fullness={fullness}
          cleanliness={cleanliness}
          intimacy={intimacy}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          onPet={petCat}
          onWalk={() => setCatAction('walk')}
          onIdle={() => setCatAction('idle')}
          onLie={() => setCatAction('lie')}
          onSleep={() => setCatAction('sleep')}
          onPlay={playWithCat}
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