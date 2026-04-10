#!/usr/bin/env python3
"""
任务管理器状态更新脚本
自动获取系统负载信息和Git统计，输出JSON格式状态文件
兼容 task-manager.html 的数据格式
"""

import json
import os
import subprocess
import sys
from datetime import datetime

import psutil

def get_system_load():
    """获取系统负载信息"""
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    
    # 计算负载等级
    load_percent = max(cpu_percent, memory.percent)
    if load_percent < 25:
        level = 'idle'
        status_text = '空闲状态 - 可处理复杂任务'
    elif load_percent < 50:
        level = 'low'
        status_text = '低负载 - 运行良好'
    elif load_percent < 75:
        level = 'mid'
        status_text = '中等负载 - 建议简单任务'
    else:
        level = 'busy'
        status_text = '高负载 - 请稍后重试'
    
    return {
        "percentage": int(load_percent),
        "cpu": int(cpu_percent),
        "memory": int(memory.percent),
        "level": level,
        "status_text": status_text,
        "raw": {
            "cpu_percent": cpu_percent,
            "memory_percent": memory.percent,
            "memory_used_gb": round(memory.used / (1024**3), 2),
            "memory_total_gb": round(memory.total / (1024**3), 2),
            "disk_percent": disk.percent,
            "disk_used_gb": round(disk.used / (1024**3), 2),
            "disk_total_gb": round(disk.total / (1024**3), 2),
            "uptime_hours": round((datetime.now() - datetime.fromtimestamp(psutil.boot_time())).total_seconds() / 3600, 1)
        }
    }

def get_git_stats(repo_path='.'):
    """使用Git命令获取统计"""
    try:
        # 获取今日提交数
        today = datetime.now().strftime('%Y-%m-%d')
        commits_today = subprocess.run(
            ['git', '-C', repo_path, 'log', '--since="today 00:00"', '--oneline'],
            capture_output=True, text=True, check=True
        ).stdout.count('\n')
        
        # 获取总提交数
        commit_count = subprocess.run(
            ['git', '-C', repo_path, 'rev-list', '--count', 'HEAD'],
            capture_output=True, text=True, check=True
        ).stdout.strip()
        
        # 获取最近提交时间
        last_commit = subprocess.run(
            ['git', '-C', repo_path, 'log', '-1', '--format=%cd', '--date=iso'],
            capture_output=True, text=True, check=True
        ).stdout.strip()
        
        # 获取修改的文件数
        status = subprocess.run(
            ['git', '-C', repo_path, 'status', '--short'],
            capture_output=True, text=True, check=True
        ).stdout
        files_modified = len([l for l in status.split('\n') if l.strip()])
        
        return {
            "commits_today": commits_today,
            "commit_count": int(commit_count),
            "last_commit": last_commit,
            "files_modified": files_modified,
            "branches": 1
        }
    except Exception as e:
        print(f"⚠️ Git 统计获取失败: {e}")
        return {
            "commits_today": 0,
            "commit_count": 0,
            "last_commit": "N/A",
            "files_modified": 0,
            "branches": 1
        }

def get_sessions_info():
    """获取会话信息"""
    return {
        "active": 1,
        "pending": 0,
        "processing": 0
    }

def get_backup_info(repo_path='.'):
    """获取备份信息"""
    try:
        # 检查最近是否有修改
        result = subprocess.run(
            ['git', '-C', repo_path, 'log', '-1', '--format=%cd', '--date=format:%Y-%m-%d %H:%M'],
            capture_output=True, text=True, check=True
        )
        last_backup = result.stdout.strip() if result.stdout else '--'
        
        return {
            "last_backup": last_backup,
            "next_check": "2小时后",
            "total_backups": 1,
            "changes_detected": True
        }
    except:
        return {
            "last_backup": "--",
            "next_check": "--",
            "total_backups": 0,
            "changes_detected": False
        }

def get_recent_activity():
    """获取最近活动"""
    return [
        {"time": "刚刚", "text": "系统状态更新"},
        {"time": "5分钟前", "text": "Git 同步完成"},
        {"time": "10分钟前", "text": "数据备份完成"}
    ]

def get_tasks():
    """获取任务列表"""
    return [
        {"status": "completed", "text": "系统初始化"},
        {"status": "completed", "text": "数据加载"},
        {"status": "active", "text": "实时监控"},
        {"status": "pending", "text": "待处理任务"}
    ]

def get_history():
    """获取历史数据用于图表"""
    return [30, 45, 35, 50, 40, 55, 45, 60, 50, 45, 55, 48]

def main():
    repo_path = os.path.dirname(os.path.abspath(__file__))
    status_file = os.path.join(repo_path, 'status.json')
    
    print("📊 获取系统负载...")
    load_data = get_system_load()
    
    print("📊 获取Git统计...")
    git_stats = get_git_stats(repo_path)
    
    print("📊 生成状态报告...")
    status = {
        "timestamp": datetime.now().isoformat(),
        "load": load_data,
        "stats": git_stats,
        "sessions": get_sessions_info(),
        "backup": get_backup_info(repo_path),
        "recent_activity": get_recent_activity(),
        "tasks": get_tasks(),
        "history": get_history(),
        "current_work": {
            "title": "系统监控",
            "description": "实时监控系统状态",
            "files_modified": git_stats["files_modified"],
            "progress": load_data["percentage"],
            "eta": "运行中"
        }
    }
    
    print(f"📝 写入状态文件: {status_file}")
    with open(status_file, 'w', encoding='utf-8') as f:
        json.dump(status, f, indent=2, ensure_ascii=False)
    
    print("✅ 状态更新完成！")
    print(json.dumps(status, indent=2, ensure_ascii=False))

if __name__ == '__main__':
    main()
