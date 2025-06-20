# Generated by Django 5.0.7 on 2025-04-11 07:04

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mentor', '0003_rename_qualification_mentorprofile_current_role_and_more'),
        ('students', '0004_mentorconnection'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('sdgs', models.CharField(help_text='Sustainable Development Goals', max_length=500)),
                ('tech_stack', models.CharField(help_text='Technologies used', max_length=500)),
                ('github_link', models.URLField(blank=True, null=True)),
                ('project_file', models.FileField(blank=True, null=True, upload_to='project_files/')),
                ('status', models.CharField(choices=[('in_progress', 'In Progress'), ('completed', 'Completed'), ('under_review', 'Under Review')], default='in_progress', max_length=20)),
                ('mentor_feedback', models.TextField(blank=True, null=True)),
                ('mentor_grade', models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('mentor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='guided_projects', to='mentor.mentorprofile')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to='students.studentprofile')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
